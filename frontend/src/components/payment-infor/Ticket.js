// import React from 'react';
// import { Container, Row, Col, Card, Image } from 'react-bootstrap';
// import { useLocation, useNavigate } from "react-router-dom";
// import { useCheckout } from './CheckoutContext';
// function Ticket() {
  // const { state } = useLocation();  
  // const { selectedSeats, showtimeDetails, movieTitle, snacks, moviePosterUrl, paymentSuccess } = state || {}; 

  

//   return (
//     <Container className="d-flex justify-content-center" fluid>
//       <Card className="ticket-container">
//         <Row className="g-2">
//           {/* <Col lg={4} md={5} sm={12} className="text-center d-flex flex-column justify-content-center align-items-center ticket-left">
//             <p>Mã lấy vé:</p>
//             <p className="ticket-code">WW8RKNR</p>
//           </Col> */}
//           <Col lg={8} md={7} sm={12} className="d-flex align-items-center ticket-right">
//             <Row className="w-100">
//               <Col xs={12} md={4} className="text-center mb-md-0">
//                 <Image
//                   src={moviePosterUrl}
//                   alt="Movie Poster"
//                   fluid
//                   className="movie-poster-ticket"
//                 />
//               </Col>
//               <Col xs={12} md={8}>
//                 <Card.Body>
//                   <Card.Title className="movie-title-ticket">
//                     {movieTitle}
//                   </Card.Title>
//                   <Card.Text className="movie-details-ticket">
//                     📅 <strong>Ngày:</strong> {new Date(showtimeDetails?.showtimeAt).toLocaleDateString('en-GB')}
//                   </Card.Text>
//                   <Card.Text className="movie-details-ticket">
//                     ⏰ <strong>Suất chiếu:</strong> {new Date(showtimeDetails?.showtimeAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
//                   </Card.Text>
//                   <Card.Text className="movie-details-ticket">
//                     📍 <strong>Rạp:</strong> {showtimeDetails?.screen?.cinema?.cinemaName}
//                   </Card.Text>
//                   <Card.Text className="movie-details-ticket">
//                     💺 <strong>Ghế:</strong> {selectedSeats?.map(seat => seat.seatName).join(', ')}
//                   </Card.Text>
//                   <Card.Text className="movie-details-ticket">
//                     🍿 <strong>Đồ ăn đã chọn:</strong>
//                     <ul>
//                       {snacks && snacks.map(snack => (
//                         <li key={snack.snackId}>
//                           {snack.snackName} x {snack.quantity} 
//                         </li>
//                       ))}
//                     </ul>
//                   </Card.Text>

//                   {paymentSuccess ? (
//                     <h4 className="text-success">Thanh toán thành công!</h4>
//                   ) : (
//                     <h4 className="text-danger">Thanh toán thất bại!</h4>
//                   )}
//                 </Card.Body>
//               </Col>
//             </Row>
//           </Col>
//         </Row>
//       </Card>
//     </Container>
//   );
// }

// export default Ticket;

import React from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import { useCheckout } from './CheckoutContext';
import { useLocation } from "react-router-dom";
function Ticket() {
  // const { checkoutData } = useCheckout(); // Access data from context
  // const { selectedSeats, showtimeDetails, movieTitle, snacks, moviePosterUrl } = checkoutData;
  const { state } = useLocation();  
  const { selectedSeats, showtimeDetails, movieTitle, snacks, moviePosterUrl,  } = state || {}; 
  return (
    <Container className="d-flex justify-content-center" fluid>
      <Card className="ticket-container">
        <Row className="g-2">
          <Col lg={8} md={7} sm={12} className="d-flex align-items-center ticket-right">
            <Row className="w-100">
              <Col xs={12} md={4} className="text-center mb-md-0">
                <Image
                  src={moviePosterUrl}
                  alt="Movie Poster"
                  fluid
                  className="movie-poster-ticket"
                />
              </Col>
              <Col xs={12} md={8}>
                <Card.Body>
                  <Card.Title className="movie-title-ticket">
                    {movieTitle}
                  </Card.Title>
                  <Card.Text className="movie-details-ticket">
                    📅 <strong>Ngày:</strong> {new Date(showtimeDetails?.showtimeAt).toLocaleDateString('en-GB')}
                  </Card.Text>
                  <Card.Text className="movie-details-ticket">
                    ⏰ <strong>Suất chiếu:</strong> {new Date(showtimeDetails?.showtimeAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  </Card.Text>
                  <Card.Text className="movie-details-ticket">
                    📍 <strong>Rạp:</strong> {showtimeDetails?.screen?.cinema?.cinemaName}
                  </Card.Text>
                  <Card.Text className="movie-details-ticket">
                    💺 <strong>Ghế:</strong> {selectedSeats?.map(seat => seat.seatName).join(', ')}
                  </Card.Text>
                  <Card.Text className="movie-details-ticket">
                    🍿 <strong>Đồ ăn đã chọn:</strong>
                    <ul>
                      {snacks && snacks.map(snack => (
                        <li key={snack.snackId}>
                          {snack.snackName} x {snack.quantity} 
                        </li>
                      ))}
                    </ul>
                  </Card.Text>
                  

                  
                    <h4 className="text-success">Thanh toán thành công!</h4>
                </Card.Body>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

export default Ticket;
