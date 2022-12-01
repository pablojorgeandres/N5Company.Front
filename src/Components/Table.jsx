import React, { useState, useEffect } from 'react';
import { Container, Button, Toolbar, Typography, TablePagination, Table, Badge, TableBody, TableCell, TableRow, TableContainer, TableHead, Paper, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PermissionModal from './Modals/PermissionModal';
import PermissionTypeModal from './Modals/PermisionTypeModal';
import setRequest from "../Utils/request";

export default function MaterialTable() {

  const [data, setData] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [openType, setOpenType] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [id, setId] = useState("");

  const getData = async () => {
    try {
      const { result } = await setRequest(`/api/v1/permission`, "get")
      setData(result);
    } catch (error) {
      console.log( error.message );
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpen = () => {
    setOpen(true);
    setIsNew(true);
  };

  const handleEditOpen = (id) => {
    setOpen(true);
    setIsNew(false);
    setId(id);
  };

  const handleClose = () => {
    setOpen(false);
    setIsNew(false);
    getData();
  }

  const handleOpenType = () => {
    setOpenType(true);
    setIsNew(true);
  };

  const handleCloseType = () => {
    setOpenType(false);
    setIsNew(false);
  }

  return (
    <Container>
      <Toolbar>
        <Typography component="h1" variant="h5" color="#1976d2" noWrap sx={{ flexGrow: 2, m: 2 }}>
          Permission Process
        </Typography>
        <Tooltip title="Add New Permission">
          <IconButton onClick={handleOpen}>
            <AddCircleIcon color="primary" />
          </IconButton>
        </Tooltip>
      </Toolbar>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="material table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1976D2", "& th": { fontSize: "1rem", color: "#FFFFFF" } }}>
              <TableCell align="center"> Actions </TableCell>
              <TableCell align="center"> First Name </TableCell>
              <TableCell align="center"> Last Name </TableCell>
              <TableCell align="center"> Permission Date </TableCell>
              <TableCell align="center"> Permission Type </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.id}>
                <TableCell align="center">{
                  <IconButton aria-label="update" onClick={(event) => handleEditOpen(row.id)}>
                    <Tooltip title="Update Permission">
                      <EditIcon color="primary" />
                    </Tooltip>
                  </IconButton>}</TableCell>
                <TableCell align="center">{row.employee_first_name}</TableCell>
                <TableCell align="center">{row.employee_last_name}</TableCell>
                <TableCell align="center">{new Date(row.permission_date).toLocaleDateString()}</TableCell>
                <TableCell align="center">{
                  <Badge
                    badgeContent={row.PermissionType.description} color='primary'
                  />
                }</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Toolbar>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <Tooltip title="Add New Permission Type for DDList">
            <Button variant="outlined" sx={{ ml: 62.5 }} onClick={handleOpenType}> Create Type</Button>
          </Tooltip>
        </Toolbar>
      </TableContainer>
      {open && (<PermissionModal open={open} handleClose={handleClose} isNew={isNew} id={id} />)}
      {openType && (<PermissionTypeModal open={openType} handleCloseType={handleCloseType} />)}
    </Container>
  );
}