import React from 'react';
import { default as Grid, default as Item } from "@mui/material/Grid"
import { Modal, Box, Typography, Button, TextField, Select, MenuItem, InputLabel } from '@mui/material';
import { useEffect, useState } from "react";
import setRequest from "../../Utils/request"
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
    description: "",
}

const footerStyle = {
    marginTop: "3vh",
    textAlign: "center",
}

export default function PermissionModal({ open, handleCloseType }) {

    const [data, setData] = useState({ ...defaultBody });
    const [error, setError] = useState("");

    const handleChange = (event) => {
        setData({ ...data, [event.target.name]: event.target.value })
    }

    const handleSubmit = async (event) => {
        try {
            await setRequest(`/api/v1/permissiontype`, "post", data)
            handleCloseType()
            return
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <Modal
            open={open}
            onClose={handleCloseType}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <Box sx={{ ...style, width: 300 }}>
                <Typography id="parent-modal-title" variant="h6" color="#1976d2" sx={{ my: 2 }}>Create Permission Type for DD List</Typography>
                {error && <Typography id="parent-modal-description" variant="h6" color="error">Error: {error}</Typography>}
                <Grid container spacing={2}>
                    <Grid item xs={12} md={12}>
                        <Item>
                            <TextField
                                id="description"
                                name="description"
                                label="Description"
                                variant="standard"
                                value={data.description}
                                onChange={handleChange}
                            />
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
                            <Button variant="text" color="error" onClick={handleCloseType}>
                                Cancel
                            </Button>
                        </Item>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
}
