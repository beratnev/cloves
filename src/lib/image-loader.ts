export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  if (src.startsWith("https://res.cloudinary.com/") && src.includes("/upload/")) {
    const [prefix, rest] = src.split("/upload/");
    const cleanedRest = rest.replace(/^q_auto,f_auto,w_\d+\//, "");
    const params = `f_auto,c_limit,w_${width},q_${quality || "auto"}`;
    return `${prefix}/upload/${params}/${cleanedRest}`;
  }
  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}w=${width}`;
}
