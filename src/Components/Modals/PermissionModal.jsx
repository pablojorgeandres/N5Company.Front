import React from 'react';
import { default as Grid, default as Item } from "@mui/material/Grid"
import { Modal, Box, Typography, Button, TextField, Select, MenuItem, InputLabel } from '@mui/material';
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import setRequest from '../../Utils/request';

const defaultBody = {
    nombreEmpleado: "",
    apellidoEmpleado: "",
    tipoPermiso: "",
    fechaPermiso: new Date()
}

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: "15px",
    border: "solid 1px",
    boxShadow: 24,

    pt: 2,
    px: 4,
    pb: 3,
}

const footerStyle = {
    marginTop: "3vh",
    textAlign: "center",
}

export default function PermissionModal({ open, isNew, handleClose, id }) {

    const [permission, setPermission] = useState({ ...defaultBody });
    const [permissionTypes, setPermissionTypes] = useState([]);
    const [error, setError] = useState("");

    const getData = async () => {
        try {
            if (!isNew && id) {
                const result = await setRequest("/api/v1/permission", "get")
                const permission = result.filter(x => x.id == id)[0]
                setPermission(permission)
            }
            const result = await setRequest(`/api/v1/permissiontype`, "get")
            setPermissionTypes(result);
        } catch (error) {
            setError(error.message)
        }
    }

    useEffect(() => {
        getData()
    }, [])

    const handleChange = (event) => {
        setPermission({ ...permission, [event.target.name]: event.target.value });
    }

    const handleSubmit = async (event) => {
        try {
            if (!isNew && id) {
                await setRequest(`/api/v1/permission`, "put", permission)
                handleClose()
                return
            }

            await setRequest(`/api/v1/permission`, "post", permission)
            handleClose()
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <Box sx={{ ...style, width: 400 }}>
                <Typography id="parent-modal-title" variant="h6" color="#1976d2" sx={{ my: 2 }}>{isNew ? "Create Permission" : "Edit Permission"}</Typography>
                {error && <Typography id="parent-modal-description" variant="h6" color="error">Error: {error}</Typography>}
                <Grid container spacing={2}>
                    <Grid item xs={12} md={12}>
                        <Item>
                            <TextField
                                id="nombreEmpleado"
                                name="nombreEmpleado"
                                label="First Name"
                                variant="standard"
                                value={permission.nombreEmpleado}
                                onChange={handleChange}
                            />
                        </Item>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Item>
                            <TextField
                                id="apellidoEmpleado"
                                name="apellidoEmpleado"
                                label="Last Name"
                                variant="standard"
                                value={permission.apellidoEmpleado}
                                onChange={handleChange}
                            />
                        </Item>
                    </Grid>
                    {isNew && <Grid item xs={12} md={12}>
                        <Item>
                            <InputLabel id="permission-date">
                                Permision Date
                            </InputLabel>
                            <DatePicker dateFormat="yyyy/MM/dd" selected={permission.fechaPermiso} onChange={(date) => handleChange({ target: { name: 'fechaPermiso', value: date } })} />
                        </Item>
                    </Grid> }
                    <Grid item xs={12}>
                        <Item>
                            <InputLabel id="permission-type">
                                Permision Type
                            </InputLabel>
                            <Select
                                labelId="permission-type-label"
                                id="tipoPermiso"
                                name="tipoPermiso"
                                value={permission.tipoPermiso}
                                onChange={handleChange}
                                variant="standard"
                                sx={{ m: 1, minWidth: 200 }}
                            >
                                {permissionTypes.map(({ descripcion, id }) => (
                                    <MenuItem value={id} key={descripcion}>
                                        {descripcion}
                                    </MenuItem>)
                                )}
                            </Select>
                        </Item>
                    </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ ...footerStyle }}>
                    <Grid item xs={6}>
                        <Item>
                            <Button variant="text" color="success" onClick={handleSubmit}>
                                Save
                            </Button>
                        </Item>
                    </Grid>
                    <Grid item xs={6}>
                        <Item>
                            <Button variant="text" color="error" onClick={handleClose}>
                                Cancel
                            </Button>
                        </Item>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
}
