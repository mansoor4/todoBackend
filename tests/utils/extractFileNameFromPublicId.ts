const extractFileNameFromPublicId = (publicId: string): string => publicId.split('/')[1].split('_')[2];

export default extractFileNameFromPublicId;
