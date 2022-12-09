import Entity, { RENDER_CB_TYPE } from '@lib/components/render/entity/entity'
// #ifdef USE-SPINE
import spine from '@lib/common/lib/spine-canvas.js'
// #endif

export default class Spine extends Entity {
  skeletonRenderer
  assetManager
  skeleton
  state
  bounds
  cache = { anim: '', loop: true, skin: '' }

  constructor(cvs, src) {
    super(cvs)
    // #ifdef USE-SPINE
    this.init(src)
    // #endif
  }

  async init(src) {
    const name = src.split('/').pop()
    this.skeletonRenderer = new spine.SkeletonRenderer(this.context)

    // Load the assets.
    this.assetManager = new spine.AssetManager(this.canvas)
    this.assetManager.loadText(`${src}.json`)
    this.assetManager.loadTextureAtlas(`${src}.atlas`)
    await this.assetManager.loadAll()

    // Create the texture atlas and skeleton data.
    const atlas = this.assetManager.require(`${name}.atlas`)
    const atlasLoader = new spine.AtlasAttachmentLoader(atlas)
    const skeletonJson = new spine.SkeletonJson(atlasLoader)
    const skeletonData = skeletonJson.readSkeletonData(
      this.assetManager.require(`${name}.json`)
    )

    // Instantiate a new skeleton based on the atlas and skeleton data.
    this.skeleton = new spine.Skeleton(skeletonData)
    this.skeleton.scaleY = -1
    this.w = this.w === 0 ? this.skeleton.data.width : this.w
    this.h = this.h === 0 ? this.skeleton.data.height : this.h
    this.skeleton.setToSetupPose()
    this.skeleton.updateWorldTransform()
    this.bounds = this.skeleton.getBoundsRect()

    // Setup an animation state with a default mix of 0.2 seconds.
    const animationStateData = new spine.AnimationStateData(this.skeleton.data)
    animationStateData.defaultMix = 0.2
    this.state = new spine.AnimationState(animationStateData)

    const that = this
    this.state.addListener({
      complete() {
        this.triggerCb(RENDER_CB_TYPE.ANIM_END)
      }
    })

    this.ready = true
    this.setSkin(this.cache.skin)
    this.play(this.cache.anim, this.cache.loop)
  }

  render(delta) {
    const scaleX = (this.scale * this.w) / this.skeleton.data.width
    const scaleY = (this.scale * this.h) / this.skeleton.data.height
    const centerX = this.bounds.x + this.bounds.width * this.anchor.x
    const centerY = this.bounds.y + this.bounds.height * this.anchor.y

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

  draw(delta) {
    if (!this.ready || !this.visible) return
    this.context.save()
    this.render(delta)
    super.draw(delta)
    this.context.restore()
  }
}
