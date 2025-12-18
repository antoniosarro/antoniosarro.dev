export function getOptimizedImagePath(src: string): string {
	return src.replace('/images/', '/images-optimized/').replace(/\.(jpg|jpeg|png)$/, '.webp');
}
