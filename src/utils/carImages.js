const localImages = [
  '/images/pic1.png',
  '/images/pic2.png',
  '/images/pic3.png',
  '/images/pic4.png',
  '/images/pic5.png',
  '/images/pic6.png',
  '/images/pic7.png'
];

export const getCarImages = car => {
  const images = Array.isArray(car?.images) ? car.images.filter(Boolean) : [];
  if (images.length) return images;
  const index = Math.abs(String(car?.id || '').split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)) % localImages.length;
  return [localImages[index], localImages[(index + 1) % localImages.length]];
};

export const getCarImage = car => getCarImages(car)[0];
