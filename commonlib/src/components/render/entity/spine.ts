import Entity from '@lib/components/render/entity/entity'
import spine from '@lib/common/lib/spine-canvas.js'

export default class Spine extends Entity {
  name
  skeletonRenderer
  assetManager
  skeleton
  state
  bounds

  constructor(cvs, src) {
    super(cvs)
    this.name = src.split('/').pop()
    this.skeletonRenderer = new spine.canvas.SkeletonRenderer(this.context)
    this.assetManager = new spine.canvas.AssetManager(this.canvas)
    this.assetManager.loadText(`${src}.json`)
    this.assetManager.loadText(`${src}.atlas`)
    this.assetManager.loadTexture(`${src}.png`)
  }

  calculateBounds(skeleton) {
    skeleton.setToSetupPose()
    skeleton.updateWorldTransform()
    const offset = new spine.Vector2()
    const size = new spine.Vector2()
    skeleton.getBounds(offset, size, [])
    return { offset, size }
  }

  load() {
    const atlas = new spine.TextureAtlas(
      this.assetManager.get(`${this.name}.atlas`)
    )
    atlas.setTextures(this.assetManager)
    const atlasLoader = new spine.AtlasAttachmentLoader(atlas)
    const skeletonJson = new spine.SkeletonJson(atlasLoader)
    const skeletonData = skeletonJson.readSkeletonData(
      this.assetManager.get(`${this.name}.json`)
    )

    this.skeleton = new spine.Skeleton(skeletonData)
    this.w = this.skeleton.data.width
    this.h = this.skeleton.data.height

    this.state = new spine.AnimationState(
      new spine.AnimationStateData(this.skeleton.data)
    )

    this.bounds = this.calculateBounds(this.skeleton)
  }

  render(delta) {
    const centerX = this.bounds.offset.x + this.bounds.size.x * this.anchor.x
    const centerY = this.bounds.offset.y + this.bounds.size.y * this.anchor.y
    this.context.translate(-centerX, -centerY)
    this.context.translate(zkit.utils.rpx2px(this.x), zkit.utils.rpx2px(this.y))

    this.state.update(delta / 1000)
    this.state.apply(this.skeleton)
    this.skeleton.updateWorldTransform()

    this.skeletonRenderer.draw(this.skeleton)
  }

  draw(delta) {
    if (!this.ready && this.assetManager.isLoadingComplete()) {
      this.load()
      this.ready = true
    }
    if (!this.ready || !this.visible) return
    this.context.save()
    this.render(delta)
    super.draw(delta)
    this.context.restore()
  }
}

// this.skeleton.setSkinByName('default')
//     this.state.setAnimation(0, '', true)
//     this.state.addListener({
//       event(trackIndex, event) {
//         // console.log("Event on track " + trackIndex + ": " + JSON.stringify(event));
//       },
//       complete(trackIndex, loopCount) {
//         // console.log("Animation on track " + trackIndex + " completed, loop count: " + loopCount);
//       },
//       start(trackIndex) {
//         // console.log("Animation on track " + trackIndex + " started");
//       },
//       end(trackIndex) {
//         // console.log("Animation on track " + trackIndex + " ended");
//       }
//     })