import React from 'react'
import { Button, Dropdown } from 'semantic-ui-react'

const DropdownFloating = (props) => {
  const onChange = (e, data) => {
    if (data.value in props.dropdownActions) {
      props.dropdownActions[data.value]();
    }
  }
  
  return (
    <Button.Group onClick={(e) => e.preventDefault()}>
      <Button onClick={props.mainButtonAction}>{props.text}</Button>
      <Dropdown
        type='button'
        as={Button}
        className='icon'
        floating
        onChange={onChange}
        options={props.options}
        trigger={<React.Fragment />}
      />
    </Button.Group>
  );
}

export default DropdownFloating;
