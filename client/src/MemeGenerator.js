import React, { useRef, useState } from 'react';

export default function MemeGenerator() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const canvasRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (event) {
      setImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlLoad = () => {
    if (imageUrl) setImage(imageUrl);
  };

  // Draw meme
  const drawMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext('2d');
    const img = new window.Image();
    img.src = image;
    img.onload = () => {
      // Fit to canvas (400x400, simple and fast)
      canvas.width = 400;
      canvas.height = 400;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.font = 'bold 30px Impact, Arial, sans-serif';
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      // Draw top text
      ctx.fillText(topText.toUpperCase(), 200, 10, 380);
      ctx.strokeText(topText.toUpperCase(), 200, 10, 380);
      // Draw bottom text
      ctx.textBaseline = 'bottom';
      ctx.fillText(bottomText.toUpperCase(), 200, 390, 380);
      ctx.strokeText(bottomText.toUpperCase(), 200, 390, 380);
    };
  };

  // Update meme whenever image or text changes
  React.useEffect(() => {
    drawMeme();
  }, [image, topText, bottomText]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <h2>Meme Generator</h2>
      <div>
        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ margin: 8 }} />
        <input
          type="text"
          value={imageUrl}
          onChange={e => setImageUrl(e.target.value)}
          placeholder="Paste image URL"
          style={{ width: 200, margin: 8 }}
        />
        <button onClick={handleUrlLoad}>Load URL</button>
      </div>
      <div>
        <input
          type="text"
          value={topText}
          onChange={e => setTopText(e.target.value)}
          placeholder="Top Text"
          style={{ margin: 8 }}
        />
        <input
          type="text"
          value={bottomText}
          onChange={e => setBottomText(e.target.value)}
          placeholder="Bottom Text"
          style={{ margin: 8 }}
        />
      </div>
      <canvas ref={canvasRef} width={400} height={400} style={{ border: '1px solid #888', margin: 20 }} />
      <div>
        <button onClick={handleDownload} style={{ padding: '8px 16px', fontSize: 16 }}>
          Download Meme
        </button>
      </div>
    </div>
  );
}
