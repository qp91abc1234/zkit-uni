export function CORSPathRewrite(val: string) {
  const newVal = val.replace('https://cdn-s3-gjzc.my.99.com', '')
  return newVal
}
