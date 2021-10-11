import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import {
  Nav,
  Navbar,
  Container,
  Row,
  Col,
  Form,
  ListGroup,
} from "react-bootstrap";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import "./loader.css";
import { render } from "react-dom";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.paper,
  },
  table: {
    minWidth: 650,
  },
}));

export default function NavTabs() {
  const classes = useStyles();
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("loading");
  const [gifData, setGifData] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isDataFound, setDataFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      try {
        const results = await axios("https://api.giphy.com/v1/gifs/trending", {
          params: {
            api_key: "XwmHCisyv9OKaVF7FLJ3EdsDJasP42hH",
          },
        });
        console.log(results);
        setGifData(results.data.data);
      } catch (err) {
        setIsError(true);
        setTimeout(() => setIsError(false), 4000);
      }
    };
    fetchData();
  }, []);

  const renderGifs = () => {
    var itemSize = gifData.length;
    if (itemSize !== 0) {
      return gifData.map((gif) => {
        return <img src={gif.images.fixed_height.url} />;
      });
    } else {
      return <p>NO DATA FOUND</p>;
    }
  };

  const renderError = () => {
    if (isError) {
      return (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          Unable to get Gifs, please try again in a few minutes
        </div>
      );
    }
  };

  const handleSearchChange = async (event) => {
    setSearch(event.target.value);
    try {
      const results = await axios("https://api.giphy.com/v1/gifs/search", {
        params: {
          api_key: "XwmHCisyv9OKaVF7FLJ3EdsDJasP42hH",
          q: search,
        },
      });
      setGifData(results.data.data);
    } catch (err) {
      setIsError(true);
      setTimeout(() => setIsError(false), 4000);
    }
  };

  // const handleSubmit = async event => {
  //   event.preventDefault();
  //   setIsError(false);

  // };

  return (
    <div className={classes.root}>
      {renderError}
      <TabPanel>
        <Row>
          <form>
            <Col xs={7}>
              <TextField
                id="standard-full-width"
                label="Search Your Favourite GIF"
                style={{ color: "Blue" }}
                placeholder="Search"
                helperText="Welcome to Giphy Crawler!"
                fullWidth
                margin="normal"
                value={search}
                onChange={handleSearchChange}
              />
            </Col>
            <Col>
              {/* <Button
             onClick={handleSubmit}
              variant="contained"
              style={{ right: "20px", top: "20px", height: "50px" }}
            >
              {" "}
            Search
            </Button> */}
            </Col>
          </form>
        </Row>
      </TabPanel>
      <div>
        <div>{renderGifs()}</div>
      </div>
    </div>
  );
}
