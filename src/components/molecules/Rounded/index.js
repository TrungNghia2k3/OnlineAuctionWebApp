import Image from '../../atoms/Image'

function ImageRounded({ path, className, handleClick }) {
  return <Image path={path} rounded={true} className={className} handleClick={handleClick} />
}

export default ImageRounded
