const imagePath = name => `${import.meta.env.BASE_URL}images/${name}`;
const localImages = Array.from({ length: 7 }, (_, index) => imagePath(`car${index + 1}.jpg`));

export const getCarImages = car => {
  const images = (Array.isArray(car?.images) ? car.images : [])
    .filter(Boolean)
    .map(image => {
      const match = String(image).match(/pic(\d+)\.(?:png|jpe?g|webp)$/i);
      return match ? imagePath(`car${match[1]}.jpg`) : image;
    });
  if (images.length) return images;
  const index = Math.abs(String(car?.id || '').split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)) % localImages.length;
  return [localImages[index], localImages[(index + 1) % localImages.length]];
};

export const getCarImage = car => getCarImages(car)[0];
