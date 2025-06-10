async function list() {
  const res = await fetch('https://google.com');
  const text = await res.text();
  console.log('Response from Google');
  
  return {
    text
  };
}