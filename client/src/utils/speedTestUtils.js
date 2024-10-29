const BACK_END_URL=process.env.BACK_END_URL;
export const calculateDownloadSpeed = async () => {
  try {
    const startTime = Date.now();
    const response = await fetch(`${BACK_END_URL}/download`);
    if (!response.ok) throw new Error('Network response was not ok');
    const blob = await response.blob();
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    const sizeInBits = blob.size * 8;
    return (sizeInBits / duration) / 1e6;
  } catch (error) {
    console.error('Download speed test failed:', error);
    return null;
  }
};

export const calculateUploadSpeed = async () => {
  try {
    let data;
    if(BACK_END_URL.includes('localhost')){
       data = new Uint8Array(50 * 1024 * 1024);
      }else{
        data = new Uint8Array(4 * 1024 * 1024);
    }
    console.log(data.length);
    const startTime = Date.now();

    const response = await fetch(`${BACK_END_URL}/upload`, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    const sizeInBits = data.length * 8;
    return (sizeInBits / duration) / 1e6;
  } catch (error) {
    console.error('Upload speed test failed:', error);
    return null;
  }
};

export const calculateLatency = async () => {
  try {
    const startTime = Date.now();
    const response = await fetch(`${BACK_END_URL}/download`);
    if (!response.ok) throw new Error('Network response was not ok');
    const endTime = Date.now();
    return endTime - startTime;
  } catch (error) {
    console.error('Latency test failed:', error);
    return null;
  }
};
