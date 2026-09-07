const localImages = [
  '/udevs-car-showroom-management-system/images/car1.jpg',
  '/udevs-car-showroom-management-system/images/car2.jpg',
  '/udevs-car-showroom-management-system/images/car3.jpg',
  '/udevs-car-showroom-management-system/images/car4.jpg',
  '/udevs-car-showroom-management-system/images/car5.jpg',
  '/udevs-car-showroom-management-system/images/car6.jpg',
  '/udevs-car-showroom-management-system/images/car7.jpg'
];

export const getCarImages = car => {
  const images = (Array.isArray(car?.images) ? car.images : [])
    .filter(Boolean)
    .map(image => {
      const match = String(image).match(/pic(\d+)\.(?:png|jpe?g|webp)$/i);
      return match ? `/udevs-car-showroom-management-system/images/car${match[1]}.jpg` : image;
    });
  if (images.length) return images;
  const index = Math.abs(String(car?.id || '').split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)) % localImages.length;
  return [localImages[index], localImages[(index + 1) % localImages.length]];
};

export const getCarImage = car => getCarImages(car)[0];
