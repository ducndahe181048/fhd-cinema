import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const VNPayPaymentResult = () => {
    const location = useLocation();
    const { state } = useLocation();  // Nhận dữ liệu từ trang trước đó
    const { selectedSeats, showtimeDetails, movieTitle, totalPrice, snacks, moviePosterUrl } = state || {};
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/vnpay-payment${location.search}`);
        
        if (response.data.status) {
          setPaymentDetails(response.data.data); // Lưu chi tiết thanh toán vào state
        } else {
          setPaymentDetails(null); // Thanh toán thất bại
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setPaymentDetails(null); // Đặt trạng thái thanh toán là null khi lỗi
      } finally {
        setLoading(false); // Dừng trạng thái loading sau khi dữ liệu đã được xử lý
      }
    };

    checkPaymentStatus();
  }, [location.search]);

  const handleNavigateToTicket = () => {
    if (paymentDetails) {
      navigate('/ticket', { state: { 
        
        selectedSeats, 
        showtimeDetails,
         movieTitle, 
         totalPrice,
         snacks, 
         moviePosterUrl
         } });
    }
  };

  const handleNavigateToCheckout = () => {
    navigate('/checkout', { state: { paymentSuccess: false } });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="mt-4">
            <Card.Header className="text-center">
              {paymentDetails ? (
                <h4 className="text-success">Payment Successful</h4>
              ) : (
                <h4 className="text-danger">Payment Failed</h4>
              )}
            </Card.Header>
            {paymentDetails && (
              <Card.Body>
                <p><strong>Transaction ID:</strong> {paymentDetails.transactionId}</p>
                <p><strong>Order Info:</strong> {paymentDetails.orderInfo}</p>
                <p><strong>Payment Time:</strong> {paymentDetails.paymentTime}</p>
                <p><strong>Total Price:</strong> {paymentDetails.totalPrice}</p>

                {/* Button to navigate to Ticket */}
                <Button variant="primary" className="mt-3" onClick={handleNavigateToTicket}>
                  View Ticket
                </Button>
              </Card.Body>
            )}
            {!paymentDetails && (
              <Card.Body>
                <p>Payment failed. Please try again later.</p>
                {/* Button to navigate back to Checkout */}
                <Button variant="danger" className="mt-3" onClick={handleNavigateToCheckout}>
                  Retry Payment
                </Button>
              </Card.Body>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VNPayPaymentResult;
