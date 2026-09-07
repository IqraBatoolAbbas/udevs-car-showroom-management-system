const localImages = [
  '/images/car1.jpg',
  '/images/car2.jpg',
  '/images/car3.jpg',
  '/images/car4.jpg',
  '/images/car5.jpg',
  '/images/car6.jpg',
  '/images/car7.jpg'
];

export const getCarImages = car => {
  const images = (Array.isArray(car?.images) ? car.images : [])
    .filter(Boolean)
    .map(image => {
      const match = String(image).match(/pic(\d+)\.(?:png|jpe?g|webp)$/i);
      return match ? `/images/car${match[1]}.jpg` : image;
    });
  if (images.length) return images;
  const index = Math.abs(String(car?.id || '').split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)) % localImages.length;
  return [localImages[index], localImages[(index + 1) % localImages.length]];
};

export const getCarImage = car => getCarImages(car)[0];
