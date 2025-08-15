import Image from '../../../atoms/image'

function ImageRoundedCircle({ path, className }) {
  return (
    <div>
      <Image path={path} roundedCircle={true} className={className} />
    </div>
  )
}

export default ImageRoundedCircle
