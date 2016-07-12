//変数
var R,R0;
var lr,le0;
var X = 20;
var Y = 20;
var D = 3;
var t = 0;
var T = 1000;
var inpVector;
var refVector;
var timeConstant;
var timer;

//初期化
function init(){
	t = 0;
	R0 = (X > Y) ? (X / 2) : (Y / 2);
	lr0 = 0.1;
	timeConstant = T / Math.log(R0);
	inpVector = new Array(D);
	refVector = new Array(X);
	clearTimeout(timer);
	for(var x = 0;x < X; x++){
		refVector[x] = new Array(Y);
		for(var y = 0;y < Y; y++){
			refVector[x][y] = new Array(D);
			for(var d = 0;d < D; d++){
				refVector[x][y][d] = Math.random();
			}
		}
	}
}

//som
function som(){
	init();
	update();
}

//update
function update(){
	//inpVectorを決定
	setInpVector();

	//R,lr更新
	R = R0 * Math.exp(-t / timeConstant);
	lr = lr0 * Math.exp(-t / timeConstant);
	
	//学習回数
	t++;

	//BMU(Best Matched Unit)の決定
	var bmu = {
		x:0,
		y:0
	};
	getBmu(bmu);

	//refVectorの更新
	setRefVector(bmu.x,bmu.y);

	//htmlに表示
	document.getElementById("t").textContent = t;

	//canvasに描画
	draw(bmu.x,bmu.y);

	//制御
	timer = setTimeout(function(){
		update();
	},10);
	if(t >= T)clearTimeout(timer);
}

//inpVectorを決定
function setInpVector(){
	for(var d = 0;d < D;d++){
		inpVector[d] = Math.random();
	}
}

//BMU(Best Matched Unit)の決定
function getBmu(bmu){
	var dist = 0;
	var minDist = X * Y;
	for(var x = 0;x < X;x++){
		for(var y = 0;y < Y;y++){
			for(var d = 0;d < D;d++){
				var tmp = inpVector[d] - refVector[x][y][d];
				dist += tmp * tmp; 
			}
			if(dist < minDist){
				minDist = dist;
				bmu.x = x;
				bmu.y = y;
			}
			dist = 0;
		}
	}
}

//refVectorの更新
function setRefVector(BMUx,BMUy){
	for(var x = 0;x < X;x++){
		for(var y = 0;y < Y;y++){
			var dist = (x - BMUx) * (x - BMUx) + (y - BMUy) * (y - BMUy);
//			dist = Math.sqrt(dist);
			//Rの外は更新しない
		//	if(dist > R)continue;
			
			//更新式
			var theta = Math.exp(-dist / (2 * R * R));
			for(var d = 0;d < D;d++){
				refVector[x][y][d] += theta * lr * (inpVector[d] - refVector[x][y][d]);
			}
		}
	}
}

//描画
function draw(BMUx,BMUy){
	var canvas = document.getElementById("note");
	if(canvas.getContext){
		var ctx = canvas.getContext("2d");
		for(var y = 0;y < Y;y++){
			for(var x = 0;x < X;x++){
				var r = refVector[x][y][0] * 255;
				var g = refVector[x][y][1] * 255;
				var b = refVector[x][y][2] * 255;
				r = Math.floor(r);
				g = Math.floor(g);
				b = Math.floor(b);
				ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
				var size = 400 / X;	//1マスのサイズ
				ctx.fillRect(x*size,y*size,size,size);
			}
		}
	}
}
