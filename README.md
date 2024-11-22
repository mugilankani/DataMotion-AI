
# DataMotion-AI  

**DataMotion-AI** is an AI-powered platform that transforms raw data into stunning animated infographics using cutting-edge technologies like Remotion. It streamlines data storytelling by automating visualization, enabling efficient, scalable, and visually compelling presentations.  

## **Features**  
- Convert text or CSV data into animated infographics.  
- AI-driven chart type selection and customization.  
- Supports multiple graph types: Pie charts, Bar graphs, Line charts, and more.  
- Export animations as high-quality MP4 videos using **Remotion**.  
- Interactive and user-friendly interface with real-time previews.  

## **Tech Stack**  
- **Frontend**: React.js with Remotion for video rendering  
- **Backend**: Node.js with Express.js  
- **Database**: MongoDB  
- **AI**: Gemini for data parsing and chart design suggestions  

## **How It Works**  
1. **Input**: Upload text or CSV data, or input data manually through the web interface.  
2. **AI Processing**:  
   - Parse the input into structured JSON using OpenAI GPT.  
   - Select the best visualization type based on data.  
3. **Video Rendering**:  
   - Pass the visualization to **Remotion** for video creation.  
   - Customize animations and export as an MP4 video.  
4. **Output**: View and download the animated infographic video.  

## **Installation**  

### Prerequisites  
- Node.js and npm  
- MongoDB installed and running  
- Gemini API key  

### Steps  

1. Clone the repository:  
   ```bash
   git clone https://github.com/yourusername/datamotion-ai.git
   cd datamotion-ai
   ```  

2. Install dependencies for both frontend and backend:  
   ```bash
   cd backend  
   npm install  
   cd ../frontend  
   npm install  
   ```  

3. Start the backend server:  
   ```bash
   cd backend  
   npm start  
   ```  

4. Start the frontend server:  
   ```bash
   cd ../frontend  
   npm start  
   ```  

5. Access the application in your browser at `http://localhost:3000`.  


## **Usage**  

1. **Input Data**:  
   - Enter text data directly or upload a CSV file.  

2. **Preview and Customize**:  
   - View the AI-generated graph and preview animations.  
   - Adjust styles and settings for your video.  

3. **Export**:  
   - Export the animation as an MP4 video file for use in presentations or social media.  

## **Contributing**  

We welcome contributions to enhance DataMotion-AI!  
1. Fork the repository.  
2. Create a feature branch:  
   ```bash
   git checkout -b feature/your-feature-name  
   ```  
3. Commit your changes and open a pull request.  

## **License**  
This project is licensed under the MIT License. See the `LICENSE` file for more details.  

```
