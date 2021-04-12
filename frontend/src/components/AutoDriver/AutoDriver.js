import React, { useState } from 'react'
import { Button, Input, FormGroup, Label } from 'reactstrap'


const AutoDriver = (props) => {
    const [dropdownOpen, setOpen] = useState(false)

    const toggle = () => setOpen(!dropdownOpen)
    return (
        <div>
            <FormGroup>
                <Label for="exampleSelect">Select Path</Label>
                <Input type="select" name="select" id="exampleSelect">
                    <option>Go to Kitchen</option>
                    <option>Back from Kitchen</option>
                    <option>Go to Hall</option>
                    <option>Back from the Hall</option>
                    <option>Good to loff ju</option>
                    <option>Aj lof ju soł macz</option>
                </Input>
                <Button>Active auto driving</Button>
            </FormGroup>
            <Input type="pathName" name="pathName" id="pathName" placeholder="Path Name" />
            <Button>Save</Button>
        </div>


    )

}

export default AutoDriver