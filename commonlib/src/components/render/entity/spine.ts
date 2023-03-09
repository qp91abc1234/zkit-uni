import Entity, { RENDER_CB_TYPE } from '@lib/components/render/entity/entity'
// #ifdef USE-SPINE
import spine from '@lib/common/lib/js/spine-canvas.js'
// #endif

export default class Spine extends Entity {
  name
  skeletonRenderer
  assetManager
  skeleton
  state
  bounds
  cache = { anim: '', loop: true, skin: 'default' }

  constructor(cvs, src) {
    super(cvs)
    // #ifdef USE-SPINE
    this.init(src)
    // #endif
  }

  init(src) {
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
    const con = !this.ready && this.assetManager.isLoadingComplete()
    if (!con) {
      return
    }

    this.ready = true
    const atlas = new spine.TextureAtlas(
      this.assetManager.get(`${this.name}.atlas`),
      (path) => {
        return this.assetManager.get(path)
      }
    )
    const atlasLoader = new spine.AtlasAttachmentLoader(atlas)
    const skeletonJson = new spine.SkeletonJson(atlasLoader)
    const skeletonData = skeletonJson.readSkeletonData(
      this.assetManager.get(`${this.name}.json`)
    )

    this.skeleton = new spine.Skeleton(skeletonData)
    this.skeleton.scaleY = -1
    this.w = this.w === 0 ? this.skeleton.data.width : this.w
    this.h = this.h === 0 ? this.skeleton.data.height : this.h

    this.state = new spine.AnimationState(
      new spine.AnimationStateData(this.skeleton.data)
    )
    this.state.addListener({
      complete: () => {
        this.triggerCb(RENDER_CB_TYPE.ANIM_END)
      }
    })

    this.setSkin(this.cache.skin)
    this.play(this.cache.anim, this.cache.loop)
  }

  render(delta) {
    const scaleX = (this.scale * this.w) / this.skeleton.data.width
    const scaleY = (this.scale * this.h) / this.skeleton.data.height
    const centerX = this.bounds.offset.x + this.bounds.size.x * this.anchor.x
    const centerY = this.bounds.offset.y + this.bounds.size.y * this.anchor.y

    this.context.translate(-centerX * scaleX, -centerY * scaleY)
    this.context.translate(zkit.utils.rpx2px(this.x), zkit.utils.rpx2px(this.y))
    this.context.rotate((this.rotate * Math.PI) / 180)
    this.context.scale(scaleX, scaleY)
    this.context.globalAlpha = this.alpha

    this.state.update(delta / 1000)
    this.state.apply(this.skeleton)
    this.skeleton.updateWorldTransform()

    this.skeletonRenderer.draw(this.skeleton)
  }

  setSkin(skin) {
    if (this.ready) {
      skin && this.skeleton.setSkinByName(skin)
      this.bounds = this.calculateBounds(this.skeleton)
    } else {
      this.cache.skin = skin
    }
  }

  play(name, loop = true) {
    if (this.ready) {
      name && this.state.setAnimation(0, name, loop)
      this.triggerCb(RENDER_CB_TYPE.CHANGE_ANIM)
    } else {
      this.cache.anim = name
      this.cache.loop = loop
    }
  }

  draw(delta: number) {
    // #ifdef USE-SPINE
    this.load()
    // #endif
    if (!this.ready || !this.visible) return
    this.context.save()
    this.render(delta)
    super.draw(delta)
    this.context.restore()
  }
}
