import React, { useState } from 'react'
import { Button, Input, FormGroup, Label } from 'reactstrap'
import axios from 'axios'


const AutoDriver = props => {
    const [pathName, setPathName] = useState('')
    const [selectedPath, setSelectedPath] = useState('ignorePath')


    const savePath = () => {
        console.log('tried save path:', pathName)
        axios.post('/saveAutoDriver', { pathName: pathName != '' ? pathName : 'ignorePath' })
    }
    const activePath = () => {
        console.log('tried active path:', selectedPath)
        axios.post('/activeAutoDriver', { activatedPath: selectedPath != '' ? selectedPath : 'ignorePath' })
    }
    const getPathsListFromServer = () => {
        return new Promise(async resolve => {
            resolve(await axios.get('/showPathsAutoDriver'))
        })
    }
    const showPathsList = () => {
        let pathsFromServer = getPathsListFromServer()
        //pathsFromServer = { pathsList: ['kuchnia', 'lazienka', 'sracz'] }
        let paths = []
        pathsFromServer.pathsList.forEach(el => {
            paths.push(<option>{el}</option>)
        })
        return paths
    }
    const selectPath = e => {
        setSelectedPath(e.target.value)
        console.log("selected path:", e.target.value)
    }

    return (
        <div>
            <FormGroup>
                <Label>Select Path</Label>
                <Input type="select" name="select" onChange={e => selectPath(e)}>
                    {showPathsList()}
                </Input>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button onClick={activePath}>Active auto driving</Button></div>
            </FormGroup>
            <Input type="pathName" name="pathName" placeholder="Path Name" onChange={e => setPathName(e.target.value)} value={pathName} />

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Button onClick={savePath}>Save current path</Button></div>
        </div>


    )

}

export default AutoDriver