import React, { useState, useEffect } from 'react'
import { Button, Input, FormGroup, Label } from 'reactstrap'
import axios from 'axios'


const AutoDriver = props => {
    const [pathName, setPathName] = useState('')
    const [selectedPath, setSelectedPath] = useState('ignorePath')
    const [pathsList, setPathsList] = useState([<option></option>])

    var pathsFromServer = []
    const savePath = () => {
        console.log('tried save path:', pathName)
        axios.post('/saveAutoDriver', { pathName: pathName != '' ? pathName : 'ignorePath' })
    }
    const activePath = () => {
        console.log('tried active path:', selectedPath)
        axios.post('/activeAutoDriver', { activatedPath: selectedPath != '' ? selectedPath : 'ignorePath' })
    }
    const dropPathData = () => {
        console.log('tried drop current path data:', selectedPath)
        axios.post('/dropDataAutoDriver', {})
    }
    const refreshPathsList = async () => {
        pathsFromServer = (await axios.get('/showPathsAutoDriver')).data.pathsList
        let paths = []
        await pathsFromServer.forEach(el => { paths.push(<option>{el}</option>) })
        setPathsList(paths)
    }
    const selectPath = e => {
        setSelectedPath(e.target.value)
        console.log("selected path:", e.target.value)
    }
    useEffect(() => { refreshPathsList() }, [])
    return (
        <>
            <FormGroup>
                <Label>Select Path</Label>
                <Input type="select" name="select" onChange={e => selectPath(e)}>
                    {pathsList}
                </Input>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button onClick={activePath}>Active auto driving</Button>
                    <Button onClick={refreshPathsList}>Refresh Paths List</Button></div>
            </FormGroup>
            <Input type="pathName" name="pathName" placeholder="Path Name" onChange={e => setPathName(e.target.value)} value={pathName} />

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button onClick={savePath}>Save current path</Button>
                <Button onClick={dropPathData}>Drop current path data</Button>
            </div>
        </>


    )

}

export default AutoDriver