
task('networks', 'Prints the configured ETH network settings:', async (args, hre) => {          
  if (VERBOSE) {
    console.log(`Available Networks:`);
    console.log(hre['config']['networks']);
  } else {              
    Object.keys(chainIds).forEach(k => {
      console.log(`Network ${k}`);
      console.log(hre['config']['networks'][`${k}`]);
    })
  }
});