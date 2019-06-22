
class FaceDes {
  constructor(){
    this.modelLink  = window.location.pathname;
    Promise.all([
      faceapi.nets.faceRecognitionNet.loadFromUri(this.modelLink+'/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri(this.modelLink+'/models'),
      faceapi.nets.ssdMobilenetv1.loadFromUri(this.modelLink+'/models'),
      faceapi.nets.faceExpressionNet.loadFromUri(this.modelLink+'/models'),
      faceapi.nets.ageGenderNet.loadFromUri(this.modelLink+'/models')
    ]);
  }
  async recognition(imgFile){
    var container = document.getElementById('dyna_img');
    container.innerHTML = "";
    var image;
    var canvas;
    if (image) image.remove()
    if (canvas) canvas.remove()
    image = await faceapi.fetchImage(imgFile)
    image.width = 500;
    image.height = 300;
    container.append(image);
    canvas = faceapi.createCanvasFromMedia(image);
    var offsetHeight = parseInt(document.getElementsByClassName('card-header')[0].offsetHeight) + 9;
    canvas.style.left = "10px";
    canvas.style.top = offsetHeight+"px";
    container.append(canvas);
    const displaySize = { width: image.width, height: image.height }
    faceapi.matchDimensions(canvas, displaySize);
    const detections = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceExpressions().withAgeAndGender().withFaceDescriptor(); //await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    const box = resizedDetections.detection.box;
    const drawBox = new faceapi.draw.DrawBox(box);
    drawBox.draw(canvas);
    var faceDescription = document.createElement('div');
    faceDescription.classList.add("des-clr");
    faceDescription.innerHTML = this.description(resizedDetections, imgFile);
    container.append(faceDescription);
    document.getElementsByClassName('loader')[0].style.display = 'none';   
  }
  description(result, imgFile){
    var name = imgFile.split("/")[1].split(".")[0];
    var pronoun = "";
    var pronounPost = ["boy", "girl", "man", "woman"];
    var ageGroup = "";
    var age = parseInt(result.age, 10);
    var expression = "";

    if(result.gender == "female"){
      pronoun = "She";
    }
    else{
      pronoun = "He";
    }
    if (result.age <=2) {
      ageGroup = (result.gender == "female") ? "a baby "+pronounPost[1] : "a baby "+ pronounPost[0];
    }
    else if (result.age >=3 && result.age <= 16) {
      ageGroup = (result.gender == "female") ? "a child("+pronounPost[1] +")" : "a child("+ pronounPost[0]+")";
    }
    else if (result.age >=17 && result.age <= 30) {
      ageGroup =  (result.gender == "female") ? "a young " +pronounPost[3] : "a young " + pronounPost[2];
    }
    else if (result.age >=31 && result.age <= 45) {
      ageGroup = (result.gender == "female") ? "a middle-aged " + pronounPost[3] : "a middle-aged " + pronounPost[2];
    }
    else  if (result.age >=46) {
      ageGroup =(result.gender == "female") ? "an old " + pronounPost[3] : "an old " + pronounPost[2];
    }
    var temp = 0;
    Object.keys(result.expressions).forEach(function(key){
      if (result.expressions[key] >= temp ) {
        temp = result.expressions[key];
        expression = key;
      }
    });
    var html = name +" is <b>"+ ageGroup +".</b><br>";
    html += pronoun + " is <b>"+ age +"</b> years old.<br>";
    html += pronoun + " is in <b>"+ expression +"</b> mood.<br>";
    return html;
  }
}
