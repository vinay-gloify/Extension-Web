import Spinner from 'react-bootstrap/Spinner';
import ProgressBar from 'react-bootstrap/ProgressBar';

let ProgressBar1 = (props) => {
  // const { bgcolor, completed } = props;

  // const containerStyles = {
  //   height: 15,
  //   // width: "100%",
  //   backgroundColor: "#e0e0de",
  //   borderRadius: 50,
  //   margin: "30px 2px",
  // };

  // const fillerStyles = {
  //   height: "100%",
  //   width: `${completed}%`,
  //   backgroundColor: bgcolor,
  //   transition: "width 1s ease-in-out",
  //   borderRadius: "inherit",
  //   textAlign: "right",
  // };

  // const labelStyles = {
  //   padding: 5,
  //   color: "white",
  //   fontWeight: "bold",
  // };
 

  return (
    // <div style={containerStyles}>
    //   <div style={fillerStyles}>
    //     <span style={labelStyles}>{``}</span>
    //   </div>
    // </div>
    <div>
       {/* <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner> */}
    <ProgressBar className='my-3' animated now={100} /> 
    </div>

    // <div className="progress" role="progressbar" aria-label="Animated striped example" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
    //   <div className="progress-bar progress-bar-striped progress-bar-animated" style="width: 100%"></div>
    // </div>
  );
};

export default ProgressBar1;
