# node-image-downloader
NodeJs Tool to download and compress jpeg image from server.


## Configure using .env file
```
URL=google.com/image.png        // the url of the image
OUT_DIR=''.out/'yyyymmdd        // the out directory using 'datetime' format 
TEMP_DIR=.temp                  // the temp dir where te files are stored before compressed
FILE_FORMAT=yyyymmdd_hhMMss     // the format of file stored like 'datetime' format
JPEG_QUALITY=80                 // the quality of jpeg compression
IDLE=3000                       // the wait time before another download
```