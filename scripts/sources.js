$(async () => {
  // Test get sources
  const data = await axios.get('/user/user/sources')
  console.log(data);
})
