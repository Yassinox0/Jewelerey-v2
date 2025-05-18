import React from 'react';
import { Carousel, Container, Row } from 'react-bootstrap';

const ModestEleganceCarousel = () => {
  // Array of carousel items with images only
  const carouselItems = [
    {
      id: 1,
      image: '/assets/carousel-1.jpg',
      smallImage: '/assets/carousel-1-small.jpg',
      alt: 'Pearl Elegance'
    },
    {
      id: 2,
      image: '/assets/carousel-2.jpg',
      smallImage: '/assets/carousel-2-small.jpg',
      alt: 'Gold Perfection'
    },
    {
      id: 3,
      image: '/assets/carousel-3.jpg',
      smallImage: '/assets/carousel-3-small.jpg',
      alt: 'Statement Pieces'
    },
    {
      id: 4,
      image: '/assets/carousel-4.jpg',
      smallImage: '/assets/carousel-4-small.jpg',
      alt: 'Everyday Luxury'
    },
    {
      id: 5,
      image: '/assets/carousel-5.jpg',
      smallImage: '/assets/carousel-5-small.jpg',
      alt: 'Refined Collection'
    }
  ];

  return (
    <section className="ub-elegance-carousel">
      <Container>
        <div className="section-title">
          <h2>Featured Collection</h2>
          <div className="title-separator"></div>
        </div>
        
        <div className="carousel-wrapper">
          <Carousel 
            fade={true}
            indicators={true} 
            controls={true} 
            interval={4000} 
            className="ub-carousel"
          >
            {carouselItems.map((item) => (
              <Carousel.Item key={item.id}>
                <Row className="justify-content-center">
                  <div className="col-11 col-md-10">
                    <div className="rounded-carousel-card">
                      <picture>
                        <source media="(max-width: 768px)" srcSet={item.smallImage} />
                        <img
                          className="carousel-image"
                          src={item.image}
                          alt={item.alt}
                        />
                      </picture>
                    </div>
                  </div>
                </Row>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      </Container>
    </section>
  );
};

export default ModestEleganceCarousel; 