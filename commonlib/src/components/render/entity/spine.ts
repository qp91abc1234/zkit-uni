import Entity from '@lib/components/render/entity/entity'
import spine from '@lib/common/lib/spine-canvas.js'

export default class Spine extends Entity {
  name
  skeletonRenderer
  assetManager
  skeleton
  state
  bounds
  cache = { anim: '', loop: true, skin: '' }

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
    this.skeleton.scaleY = -1
    this.w = this.w === 0 ? this.skeleton.data.width : this.w
    this.h = this.h === 0 ? this.skeleton.data.height : this.h

    this.state = new spine.AnimationState(
      new spine.AnimationStateData(this.skeleton.data)
    )

    this.bounds = this.calculateBounds(this.skeleton)
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
    } else {
      this.cache.skin = skin
    }
  }

  play(name, loop = true) {
    if (this.ready) {
      name && this.state.setAnimation(0, name, loop)
    } else {
      this.cache.anim = name
      this.cache.loop = loop
    }
  }

  draw(delta) {
    if (!this.ready && this.assetManager.isLoadingComplete()) {
      this.ready = true
      this.load()
      this.setSkin(this.cache.skin)
      this.play(this.cache.anim, this.cache.loop)
    }
    if (!this.ready || !this.visible) return
    this.context.save()
    this.render(delta)
    super.draw(delta)
    this.context.restore()
  }
}
