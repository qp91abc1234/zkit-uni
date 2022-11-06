import Entity from '@lib/components/render/entity/entity'
import spine from '@lib/common/lib/spine-canvas.js'

export default class Spine extends Entity {
  skeletonRenderer
  assetManager
  skeleton
  state
  bounds

  constructor(cvs) {
    super(cvs)

    this.skeletonRenderer = new spine.canvas.SkeletonRenderer(this.context)
    this.assetManager = new spine.canvas.AssetManager(this.canvas)
    this.assetManager.loadText(
      'https://md-pic-lib.oss-cn-hangzhou.aliyuncs.com/tmp/spine/spineboy-ess.json'
    ) // (skelName + ".json");
    this.assetManager.loadText(
      'https://md-pic-lib.oss-cn-hangzhou.aliyuncs.com/tmp/spine/spineboy.atlas'
    ) // (skelName.replace("-pro", "").replace("-ess", "") + ".atlas");
    this.assetManager.loadTexture(
      'https://md-pic-lib.oss-cn-hangzhou.aliyuncs.com/tmp/spine/spineboy.png'
    ) // (canvas, skelName.replace("-pro", "").replace("-ess", "") + ".png");
  }

  load() {
    if (!this.ready && this.assetManager.isLoadingComplete()) {
      const data = this.loadSkeleton('spineboy-ess', 'walk', 'default')
      this.skeleton = data.skeleton
      this.state = data.state
      this.bounds = data.bounds
      this.ready = true
    }
  }

  loadSkeleton(name, initialAnimation, skin) {
    if (skin === undefined) skin = 'default'

    // Load the texture atlas using name.atlas and name.png from the AssetManager.
    // The function passed to TextureAtlas is used to resolve relative paths.
    const atlas = new spine.TextureAtlas(
      this.assetManager.get(
        `${name.replace('-pro', '').replace('-ess', '')}.atlas`
      )
    )
    atlas.setTextures(this.assetManager)

    // Create a AtlasAttachmentLoader, which is specific to the WebGL backend.
    const atlasLoader = new spine.AtlasAttachmentLoader(atlas)

    // Create a SkeletonJson instance for parsing the .json file.
    const skeletonJson = new spine.SkeletonJson(atlasLoader)

    // Set the scale to apply during parsing, parse the file, and create a new skeleton.
    const skeletonData = skeletonJson.readSkeletonData(
      this.assetManager.get(`${name}.json`)
    )
    const skeleton = new spine.Skeleton(skeletonData)

    const ratio = zkit.utils.rpx2px(skeleton.data.width) / skeleton.data.width
    skeleton.scaleX = ratio
    skeleton.scaleY = -ratio

    const bounds = this.calculateBounds(skeleton)
    skeleton.setSkinByName(skin)

    // Create an AnimationState, and set the initial animation in looping mode.
    const animationState = new spine.AnimationState(
      new spine.AnimationStateData(skeleton.data)
    )
    animationState.setAnimation(0, initialAnimation, true)
    animationState.addListener({
      event(trackIndex, event) {
        // console.log("Event on track " + trackIndex + ": " + JSON.stringify(event));
      },
      complete(trackIndex, loopCount) {
        // console.log("Animation on track " + trackIndex + " completed, loop count: " + loopCount);
      },
      start(trackIndex) {
        // console.log("Animation on track " + trackIndex + " started");
      },
      end(trackIndex) {
        // console.log("Animation on track " + trackIndex + " ended");
      }
    })

    // Pack everything up and return to caller.
    return { skeleton, state: animationState, bounds }
  }

  calculateBounds(skeleton) {
    skeleton.setToSetupPose()
    skeleton.updateWorldTransform()
    const offset = new spine.Vector2()
    const size = new spine.Vector2()
    skeleton.getBounds(offset, size, [])
    return { offset, size }
  }

  render(delta) {
    const centerX = this.bounds.offset.x + this.bounds.size.x / 2
    const centerY = this.bounds.offset.y + this.bounds.size.y / 2
    this.context.translate(-centerX, -centerY)
    this.context.translate(zkit.utils.rpx2px(375), zkit.utils.rpx2px(375))

    this.state.update(delta / 1000)
    this.state.apply(this.skeleton)
    this.skeleton.updateWorldTransform()

    this.skeletonRenderer.draw(this.skeleton)
  }

  draw(delta) {
    this.load()
    if (!this.ready || !this.visible) return
    this.context.save()
    this.render(delta)
    super.draw(delta)
    this.context.restore()
  }
}
