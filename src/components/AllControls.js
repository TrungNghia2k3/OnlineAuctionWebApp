import Pagination from './atoms/pagination'
import Toast from './atoms/toast'
import CheckBoxList from './molecules/forms/check-box-list'
import RangeBar from './molecules/forms/range-bar'
import SelectBox from './molecules/forms/select-box'
import ImageRounded from './molecules/images/rounded'
import ImageRoundedCircle from './molecules/images/rounded-circle'

const AllControls = () => {
  const options = [
    { key: '1', value: 'Phong', label: 'Phong' },
    { key: '2', value: 'Phuong', label: 'Phuong' },
  ]
  const radioOptions = [
    { key: '1', value: 'Java', label: 'Java' },
    { key: '2', value: 'C#', label: 'C#' },
    { key: '3', value: 'Python', label: 'Python' },
  ]
  const checkBoxChange = (e) => {
    const value = e.target.checked
    console.log(value)
    console.log(e.target)
  }
  const checkBoxOptions = [
    { key: '1', value: 'Male', label: 'Male', onChange: checkBoxChange },
    { key: '2', value: 'Female', label: 'Female', onChange: checkBoxChange },
    { key: '3', value: 'Another', label: 'Another', onChange: checkBoxChange },
  ]
  const dropDownOptions = [
    { key: '1', value: '6 months', label: '6 months' },
    { key: '2', value: '12 months', label: '12 months' },
  ]
  const firstNumbers = [1, 2, 3]
  const betweenNumbers = [10, 11, 12, 13, 14]
  const lastNumbers = [20]
  const activeNumber = 12
  const disabledNumbers = [14]
  return (
    <div>
      <h1>Display All controls as bellow</h1>
      <RangeBar label='Range Bar' value={10} min={0} max={100} step={5}></RangeBar>
      <SelectBox label='Select Box' options={options}></SelectBox>
      <CheckBoxList label='Check Box List' name='Gender' options={checkBoxOptions}></CheckBoxList>
      <ImageRounded path='/images/22.jpg'></ImageRounded>
      <Toast headerIcon='/images/category-browser.png' headerTitle='Category management' body='Init a table'></Toast>
      <ImageRoundedCircle path='/images/img1.png'></ImageRoundedCircle>
      <Pagination
        firstNumbers={firstNumbers}
        betweenNumbers={betweenNumbers}
        lastNumbers={lastNumbers}
        activeNumber={activeNumber}
        disabledNumbers={disabledNumbers}
      ></Pagination>
    </div>
  )
}

export { AllControls }
