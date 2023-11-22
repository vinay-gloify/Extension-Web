/* global chrome */
import React, { useEffect, useState } from "react";
import { API_ENDPOINT } from "../services/api";
import requestInstance from "../utils/request";
import "./userDashboard.css"

const UserDashboard = (props) => {
  const [responseData, setresponseData] = useState();
  

  useEffect(() => {
    requestInstance.get(API_ENDPOINT.GET_ALL_SCRAPPED_DATA_API).then((res) => {
      setresponseData(res.data["linkedin details"]);
      console.log(res.data.logged_in_user_details);
    });
  }, []);

  console.log(responseData, "15----");
  const handleInput = (e) => {
    e.preventDefault();
  };
  return (
    <div className="dashboardView">
      <div className="d-flex justify-content-center mb-3">
        <h2>Dashboard</h2>
        
      </div>
      <div className="container">
        <div className="row table-responsive">
          <div className="col-12">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">Linkedin User Name</th>
                  <th scope="col">Profile Url</th>
                  <th scope="col">First Name</th>
                  <th scope="col">Last Name</th>
                  <th scope="col">Phone Number</th>
                  <th scope="col">Email</th>
                  <th scope="col">Company</th>
                  <th scope="col">headline</th>
                </tr>
              </thead>
              <tbody>
                {responseData?.map((data, i) => (
                  <tr  key={i}>
                    <th scope="row">{i + 1}</th>
                    <td>{data.linkedin_user_name}</td>
                    <td>
                      <a href={data.profile_url} target="_blank">
                        Visit Profile
                      </a>
                    </td>
                    <td>{data.first_name}</td>
                    <td>{data.last_name}</td>
                    <td>{data?.phone_number || "NA"}</td>
                    <td>{data?.email || "NA"}</td>
                    <td>{data?.company || "NA"}</td>
                    <td>{data?.headline || "NA"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
