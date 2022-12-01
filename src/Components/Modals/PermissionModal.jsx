import React from 'react';
import { default as Grid, default as Item } from "@mui/material/Grid"
import { Modal, Box, Typography, Button, TextField, Select, MenuItem, InputLabel } from '@mui/material';
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import setRequest from '../../Utils/request';

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: "15px",
    border: "solid 1px",
    boxShadow: 24,

    pt: 2,
    px: 4,
    pb: 3,
}

const defaultBody = {
    employee_first_name: "",
    employee_last_name: "",
    permission_type_id: "",
    permission_date: new Date(), 
}

const footerStyle = {
    marginTop: "3vh",
    textAlign: "center",
}

export default function PermissionModal({ open, isNew, handleClose, id }) {

    const [data, setData] = useState({ ...defaultBody });
    const [error, setError] = useState("");
    const [ddlist, setDDList] = useState([]);


    const getData = async () => {
        try {
            if (!isNew && id) {
                const { result } = await setRequest(`/api/v1/permission/findOne/${id}`, "get")
                setData({ ...result, permission_date: new Date(result.permission_date) })
            }
            const { result } = await setRequest(`/api/v1/permissiontype`, "get")
            setDDList(result);
        } catch (error) {
            setError(error.message)
        }
    }

    useEffect(() => {
        getData()
    }, [])

    const handleChange = (event) => {
        setData({ ...data, [event.target.name]: event.target.value });
    }

    const handleSubmit = async (event) => {
        try {
            if (!isNew && id) {
                await setRequest(`/api/v1/permission`, "put", data)
                handleClose()
                return
            }

            await setRequest(`/api/v1/permission`, "post", data)
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
            <Box sx={{ ...style, width: 300 }}>
                <Typography id="parent-modal-title" variant="h6" color="#1976d2" sx={{ my: 2 }}>{isNew ? "Create Permission" : "Edit Permission"}</Typography>
                {error && <Typography id="parent-modal-description" variant="h6" color="error">Error: {error}</Typography>}
                <Grid container spacing={2}>
                    <Grid item xs={12} md={12}>
                        <Item>
                            <TextField
                                id="employee_first_name"
                                name="employee_first_name"
                                label="Employee first name"
                                variant="standard"
                                value={data.employee_first_name}
                                onChange={handleChange}
                            />
                        </Item>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Item>
                            <TextField
                                id="employee_last_name"
                                name="employee_last_name"
                                label="Employee last name"
                                variant="standard"
                                value={data.employee_last_name}
                                onChange={handleChange}
                            />
                        </Item>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Item>
                            <InputLabel id="permission-date">
                                Permision Date
                            </InputLabel>
                            <DatePicker  dateFormat="yyyy/MM/dd" selected={data.permission_date} onChange={(date) => handleChange({ target: { name: 'permission_date', value: date } })} />
                        </Item>
                    </Grid>
                    <Grid item xs={12}>
                        <Item>
                            <InputLabel id="permission-type">
                                Permision Type
                            </InputLabel>
                            <Select
                                labelId="permission-type-label"
                                id="permission_type_id"
                                name="permission_type_id"
                                value={data.permission_type_id}
                                onChange={handleChange}
                                variant="standard"
                                sx={{ m: 1, minWidth: 200 }}

                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {ddlist.map(({ description, id }) => (
                                    <MenuItem value={id} key={description}>
                                        {description}
                                    </MenuItem>
                                )
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
