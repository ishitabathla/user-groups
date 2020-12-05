import './App.css';
import { useState, useEffect } from 'react';
import {
  CircularProgress,
  Typography,
  TextField,
  Button,
  Grid
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import List from './List';
import axios from 'axios';
import MyDropzone from './MyDropzone';
const styles = makeStyles(() => ({
  main: {
    display:'flex',
    justifyContent:'flex-start',
    margin:'30px 10px',

  },
  textfieldSection:{
    display:'flex',
    flexDirection:'column',
    width:'40%'
  },
  btnSection:{
    display:'flex',
    justifyContent:'center',
    margin:20
  },
  remove:{
    marginLeft:10,
    backgroundColor:'#6e0b1c',
    color:'#FFFFFF'
  },
  title:{
    textAlign:'center',
    marginTop:20,
    fontFamily:'fangsong'
  },
  body:{
    backgroundColor:'#FFFFBF',
  },
  textfield:{
    margin:10
  },
  primaryBtn:{
    backgroundColor:'#e47e24',
    color:'#FFFFFF'
  },
}));
function App() {
  const classes = styles();
  const [userList, setUserList] = useState([]);
  const [groupDetail, setGroupDetail] = useState({name:'',description:''});
  const [selectedUsers,setSelectedUsers] = useState([]);
  const [sortOrder, setSortOrder] = useState('');
  useEffect(() => {
   fetchUsers();
  }, []);

  const fetchUsers = async() =>{
    axios.get('https://s3-ap-southeast-1.amazonaws.com/he-public-data/users49b8675.json',
    {
      headers: {"Access-Control-Allow-Origin": "*"}
    })
  .then(function ({status,data}) {
    if(status === 200){
      setUserList(data)
    }
  })
  }

  const handleText=({target:{name,value}})=>{
    setGroupDetail({...groupDetail,[name]:value});
  }
  const handleSelectUser=(id)=>{
    const users = [...selectedUsers]
    if(users.includes(id)){
      const index = users.indexOf(id);
      if (index > -1) {
        users.splice(index, 1);
        setSelectedUsers(users);
      }
    }else{
      setSelectedUsers([...selectedUsers,id]);
    }
  }

const handleSort=()=>{
  let updatedList = []
  if(!sortOrder || sortOrder==='desc'){
    updatedList = userList.sort((a, b) => a.name.localeCompare(b.name));
    setSortOrder('asc');
  }else if(sortOrder==='asc'){
    updatedList = userList.sort((a, b) => b.name.localeCompare(a.name));
    setSortOrder('desc');
  }
  setUserList(updatedList);
}
  return (
    <Grid container justify="center" className={classes.body}>
      <Grid item sm={10}>
        <div>
          <Typography variant="h4" className={classes.title}>Make User Groups!</Typography>
          <div className={classes.main}>
            <div>
              <MyDropzone/>
            </div>
            <div className={classes.textfieldSection}>
              <TextField
                className={classes.textfield}
                variant="outlined"
                value={groupDetail.name}
                onChange={handleText}
                placeholder="Group Name"
                fullWidth
                name="name"
              />
              <TextField
                className={classes.textfield}
                variant="outlined"
                value={groupDetail.description}
                onChange={handleText}
                placeholder="Group Description"
                fullWidth
                name="description"
                multiline
              />
            </div>

          </div>
          <div>
          <Button
                variant="contained"
                className={classes.primaryBtn}
                size="large"
                onClick={handleSort}
              >
                SORT USERS {sortOrder==='asc'?'(Asc)':sortOrder==='desc'?'(Desc)':''}
              </Button>
          </div>
          <br/>
          { userList.length > 0 ? (
          <List
            classes={classes}
            userList={userList}
            selectedUsers={selectedUsers}
            handleSelectUser={handleSelectUser}
          />) : (
            'No Result Found.'
          )}
           <div className={classes.btnSection}>
              <Button
                variant="contained"
                className={classes.primaryBtn}
                size="large"
              >
                Update
              </Button>
              <Button
                variant="contained"
                className={classes.remove}
                size="large"
              >
                Remove
              </Button>
            </div>
        </div>
      </Grid>
    </Grid>
  );
}

export default App;
