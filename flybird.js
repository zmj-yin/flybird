let $wrapBg = $( "div.wrapBg" );
let $bied = $( "img.bied" );
let $title = $( "div.title" );
let $start = $( "button.start" );
let $close = $( "button.close" );
let index = 0;
let $div = $( "<div class='insert'></div>" );
let blocksArr = [];  //用来储存block的数组
let birdflyTimer;
let wingTimer;
$close.css("display","none");
//小鸟下落速度
let fallSpeed = 0;
//小鸟开始摆动
//let headWaveTimer = setInterval( headWave, 600 );
function headWave()
{
	let biedArr = [ "icon/bird.png", "icon/bird1.png" ];
	$bied.attr( "src", biedArr[ index ] );
	index++;
	if( index === 2 )
	{
		index = 0;
	}
}
//让草地动起来的定时器
//let landTimer = setInterval( landRun, 10 );
let $grassLand = $( ".grassLand" );
let num = 0;
function landRun()
{

	let $left = parseInt( $grassLand.eq( 0 ).css( "left" ) );
	let $left1 = parseInt( $grassLand.eq( 1 ).css( "left" ) );
	if( $left <= -640 )
	{
		num = 0;
		$grassLand.eq( 0 ).css( "left", 640 );
	}
	if( $left1 <= -640 )
	{
		$grassLand.eq( 1 ).css( "left", "640" );
	}
	num = num - 3;
	$grassLand.eq( 0 ).css( "left", num );
	$grassLand.eq( 1 ).css( "left", num + 640 );
}

//为button按键添加点击事件处理程序
$start.on( "click", butclick );
function butclick()
{
	$bied.css( "display", "none" );
	$title.css( "display", "none" );
	$start.css( "display", "none" );
	$(".insert").css( {"display":"","left":"120px","top":"200px"});
	bied();
	$wrapBg.on( "click keydown", function()
	{
		fallSpeed = -8;
	} );
	block();
}
$close.on( "click", cloclick );
function cloclick()
{
	$bied.css( "display", "" );
	$title.css( "display", "" );
	$start.css( "display", "" );
	$close.css("display", "none");
	$div.css("display", "none");
	$(".createDiv").remove();
}

//创建小鸟对象
function bied()
{
	//点击button将小鸟插入游戏界面中
	$div.appendTo( $wrapBg );
	//控制小鸟飞翔下落的函数
	function flyBird()
	{
		//小鸟飞翔定时器
		birdflyTimer = setInterval(fly, 60 );
		//小鸟飞翔下落的函数
		function fly()
		{
			//设置小鸟的高度top值
			let $top = $div.offset().top + fallSpeed++;
			$div.css( "top", $top );
			if( $top < 0 )
			{
				fallSpeed = 2; //这里用于控制小鸟不要飞出界面
				$top = 0;
				$div.css( "top", $top );
			}
			else if( $top > 496 )
			{
				fallSpeed = 0;
				clearInterval( flyTimer );
				clearInterval( wingTimer );
			}
			if( fallSpeed > 12 )
			{
				fallSpeed = 12;
			}
		}

		//控制小鸟煽动翅膀的函数
		let up = [ "url(icon/up_bird0.png)", "url(icon/up_bird1.png)" ];
		let dowm = [ "url(icon/down_bird0.png)", "url(icon/down_bird1.png)" ];
		let i = 0;
		wingTimer = setInterval( wing, 120 );//逐帧动画，小鸟煽动翅膀
		function wing()
		{
			if( fallSpeed > 0 )
			{
				$div.css( "background", dowm[ i++ ] );
				if( i === 2 )
				{
					i = 0;
				}
			}
			else
			{
				$div.css( "background", up[ i++ ] );
				if( i === 2 )
				{
					i = 0;
				}
			}
		}
	}

	flyBird();
}

//随机生成0-150之间的数，用于控制下管道的高度
let downHeight = 0;
// 管道中间间隙宽度，通过调节大小，可以的控制游戏难度
let gapHeight = 0;
let upHeight = 0;

//障碍
function block()
{
	gapHeight = Math.random() * 315 >> 0;
	downHeight = 315 - gapHeight;
	let upDivWrap = null;
	let downDivWrap = null;

	// 生成Div的方法
	function createDiv( url, height, left, top, botton )
	{
		let $create = $( "<div class='createDiv'></div>" );
		$create.css( {
			"background": url,
			"height": height,
			"left": left,
			"top": top
		} );
		return $create;
	}

	//生成上方管道
	let $upDiv1 = createDiv( "url( 'icon/up_mod.png' )", gapHeight );
	let $upDiv2 = createDiv( "url( 'icon/up_pipe.png' )", 60, null, gapHeight );
	$upDiv1.appendTo( $wrapBg );
	$upDiv2.appendTo( $wrapBg );
	//生成下方的管道
	let $downDiv1 = createDiv( "url( 'icon/down_pipe.png' )", 60, null, 160 + gapHeight );
	let $downDiv2 = createDiv( "url( 'icon/down_mod.png' )", downHeight, null, 220 + gapHeight );
	$downDiv1.appendTo( $wrapBg );
	$downDiv2.appendTo( $wrapBg );
	let $creatediv = $( ".createDiv" );
	let $createset = setInterval( pillarmove, 20 );

	function pillarmove()
	{
		let $createleft = parseInt( $creatediv.css( "left" ) );
		$createleft -= 3;
		$creatediv.css( "left", $createleft );
		if( $div.offset().top >= 496 || collision() )
		{
			window.clearInterval( $createset );
			clearInterval( birdflyTimer );
			clearInterval( wingTimer );
			$close.css( "display", "" );
		}
		//碰撞检测
		function collision()
		{
			let bleft = $div.offset().left >> 0;
			let dleft = $upDiv1.offset().left >> 0;
			if( bleft + 42 >= dleft&&bleft<=dleft+62 )
			{
				if( $div.offset().top < gapHeight + 60 || $div.offset().top + 28 > 160 + gapHeight )
					return true;
				else
					return false;
			}
			else
			{
				return false;
			}
		}

		if( parseInt( $creatediv.css( "left" ) ) < -62 )
		{
			gapHeight = Math.random() * 315 >> 0;
			downHeight = 315 - gapHeight;
			$upDiv1.css( "height", gapHeight );
			$upDiv2.css( "top", gapHeight );
			$downDiv1.css( "top", 160 + gapHeight );
			$downDiv2.css( "height", downHeight );
			$downDiv2.css( "top", 220 + gapHeight );
			$creatediv.css( "left", 630 );
		}
	}
}



