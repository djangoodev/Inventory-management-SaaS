import {Card, CardBody, CardSubtitle, CardTitle, Col, Row} from "reactstrap";
import React from "react";

export const LeftPanel = (userInfo) => {
  const username = userInfo.username;
  const name = userInfo.name;
  const email = userInfo.email;
  const country = userInfo.country;
  const city = userInfo.city;
  const address = userInfo.address;
  const phone = userInfo.phone;
  const avatar = userInfo.avatar ? userInfo.avatar : '/resources/images/avatar.jpg';
  return (
    <Card>
      <CardBody>
        <div className="text-center mt-4">
          <img src={avatar} className="rounded-circle" width="150" alt="" />
          <CardTitle className="mt-2">{name}</CardTitle>
          <CardSubtitle>{username}</CardSubtitle>
          <Row className="text-center justify-content-md-center">
            <Col xs="4">
              <a href="/" className="link">
                <i className="icon-people"></i>
                <span className="font-medium ml-2">254</span>
              </a>
            </Col>
            <Col xs="4">
              <a href="/" className="link">
                <i className="icon-picture"></i>
                <span className="font-medium ml-2">54</span>
              </a>
            </Col>
          </Row>
        </div>
      </CardBody>
      <CardBody className="border-top">
        <div>
          <small className="text-muted">Email address </small>
          <h6>{email}</h6>
          <small className="text-muted pt-4 db">Phone</small>
          <h6>{phone}</h6>
          <small className="text-muted pt-4 db">Address</small>
          <h6>{country} {city} {address}</h6>
        </div>
      </CardBody>
    </Card>
  )
}
