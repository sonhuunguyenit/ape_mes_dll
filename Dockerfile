# Use Windows Server base image
FROM mcr.microsoft.com/windows/servercore:ltsc2022

# Install Node.js
RUN powershell -Command `
  Invoke-WebRequest https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi -OutFile node.msi ; `
  Start-Process msiexec.exe -Wait -ArgumentList '/quiet', '/i', 'node.msi' ; `
  Remove-Item -Force node.msi

# Set working directory
WORKDIR C:\\app

# Copy package and install dependencies
COPY package*.json ./
RUN npm install

# Copy full project
COPY . .

# Add working directory to PATH
ENV PATH="C:\\app;$PATH"

# Expose app port
EXPOSE 5000

# Start app
CMD ["node", "index.js"]
