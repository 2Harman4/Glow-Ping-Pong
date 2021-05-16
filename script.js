'use strict';
{
    let box = document.getElementById('box');
    let boxRect = box.getBoundingClientRect();
    let ball = document.getElementById('ball');
    let rod1 = document.getElementById('rod1');
    let rod2 = document.getElementById('rod2'); 
    let speedOfBall = 2; //pixels by which ball moves
                // speed for round 1
    let rodSpeed = 50;
    let rod1Rect = rod1.getBoundingClientRect();
    let rod2Rect = rod2.getBoundingClientRect();
    let hits = 0;
    let goRight = 'true';
    let goDown = 'true';
    let score = null;
    let enterPressed= false;
    let moveId;
    
    //the menu
    let menuClosed = false;
    let menu = document.getElementById('menu');
    let singlePlayerBtn=document.getElementById('button1');
    let doublePlayerBtn=document.getElementById('button2');
    let playButton = document.getElementById('playbtn');
    let noPlayers= 1;

    singlePlayerBtn.addEventListener('click',function(){
        noPlayers=1;
    });
    
    doublePlayerBtn.addEventListener('click',function(){
        noPlayers=2;
    });
    
    playButton.addEventListener('click',function(){
        menu.style.display ='none';
        menuClosed = true;
        
    });



    document.addEventListener('keydown', function(e){
        console.log(e.key);
        if(enterPressed){
            // controlling the rods
              
            rod1 = document.getElementById('rod1');
            rod2 = document.getElementById('rod2'); 
            rod1Rect=rod1.getBoundingClientRect();
            rod2Rect = rod2.getBoundingClientRect();
     
            //controls for single player
            if(noPlayers ==1 ){
                 // movement towards left
                if( (rod1Rect.x > boxRect.x) && (e.key == 'a' || e.key =='A' || e.key =='ArrowLeft')){
                    rod1.style.left = (rod1Rect.x - rodSpeed) + 'px';
                    rod2.style.left = (rod2Rect.x - rodSpeed) + 'px';
                }

                // movement towards right
                if( (rod1Rect.right < boxRect.right) && (e.key == 'd' || e.key =='D'|| e.key =='ArrowRight')){
                    rod1.style.left = (rod1Rect.x + rodSpeed) + 'px';
                    rod2.style.left = (rod2Rect.x + rodSpeed) + 'px';
                }
            }

            //controls for double player
            if(noPlayers == 2 ){

                //rod1
                // movement towards left
               if( (rod1Rect.x > boxRect.x) && (e.key == 'a' || e.key =='A' )){
                   rod1.style.left = (rod1Rect.x - rodSpeed) + 'px';
               }

               // movement towards right
               if( (rod1Rect.right < boxRect.right) && (e.key == 'd' || e.key =='D')){
                   rod1.style.left = (rod1Rect.x + rodSpeed) + 'px';
               }

                //rod2
                // movement towards left
                if( (rod2Rect.x > boxRect.x) && (e.key =='ArrowLeft')){
                    
                    rod2.style.left = (rod2Rect.x - rodSpeed) + 'px';
                }
 
                // movement towards right
                if( (rod2Rect.right < boxRect.right) && ( e.key =='ArrowRight')){                  
                    rod2.style.left = (rod2Rect.x + rodSpeed) + 'px';
                }               
            }





            // to pause the game press Esc      
                if(e.key == 'Escape'){
                    
                    clearInterval(moveId);
                    enterPressed=false;

                    menu.style.display = 'flex';
                    menuClosed= false;
                }
          
        }

        
        // GAME STARTS HERE
        if(e.key == 'Enter'){

            if(!enterPressed){

                enterPressed=true;
                boxRect = box.getBoundingClientRect();
        
                // the setInterval helps in animating the movement of ball
                moveId = setInterval(moveTheBall,10);
    
                
                // this function is responsible for a single location change of ball
                function moveTheBall(moveId){
                    
                    rod1 = document.getElementById('rod1');
                    rod2 = document.getElementById('rod2'); 
                    rod1Rect=rod1.getBoundingClientRect();
                    rod2Rect = rod2.getBoundingClientRect();
                                
                    let ballRect = ball.getBoundingClientRect();
                    
                    // the ball moves right
                    if(goRight){
                        ball.style.left = (ballRect.x + speedOfBall) + 'px';
    
                        // this will prevent the ball to escape through right
                        if( ballRect.right  > boxRect.right){
                            goRight=false;
                        }
                    }
    
                    // the ball moves left
                    if(!goRight){
                        ball.style.left = (ballRect.x - speedOfBall) + 'px';
    
                        // this will prevent the ball to escape through left
                        if( ballRect.x < 0){
                            goRight=true;
                        }
                    }
    
                    // the ball moves down towards rod2
                    if(goDown){
                        
                        if(ballRect.bottom < boxRect.bottom - (ballRect.height * .4) ){
                            ball.style.top = (ballRect.y + speedOfBall) + 'px';
    
                        // this will prevent the ball to escape through bottom
                        }else{
                            
                                // ball bounces only if it is hit by rod2
                            if( (ballRect.right >= rod2Rect.x) && ( ballRect.x <= rod2Rect.right)){
                                goDown=false;
                                hitSound();
                                hits++;
                                raiseDifficulty(hits);
                            } else {
                                //game finishes
                           
                                hits++;
                                score= hits *100;
                                endGame('player1',score,moveId);
                            }
                        
                        }
                    }
                    
                
    
                    // the ball moves up towards rod1
                    if(!goDown){
                        if( ballRect.y - speedOfBall > (ballRect.height* .4) ){
                                ball.style.top = (ballRect.y - speedOfBall) + 'px';
    
                            // this will prevent the ball to escape through bottom
                        }else{
                            // ball bounces only if it is hit by rod1
                            if( (ballRect.right >= rod1Rect.x) && ( ballRect.x <= rod1Rect.right)){
                                goDown=true;
                                hitSound();
                                hits++;
                                raiseDifficulty(hits);
                            } else {
                                        //game finishes
                                        hits++;
                                        score= hits *100;
                                        endGame('player2',score,moveId);
                                    } 
                        }
                    }    
                }


                // audio for a hit
                function hitSound() {
                    let audio = new Audio('https://assets.mixkit.co/sfx/download/mixkit-punching-boxing-gloves-hit-2103.wav');
                    audio.play();
                }

                // audio played at game starts
                // function startSound() {
      
                //     let audio = new Audio('https://assets.mixkit.co/sfx/download/mixkit-musical-game-over-959.wav');
                //     audio.play();
                // }
                
                // raises raiseDifficulty
                function raiseDifficulty(hits){
                    if((hits >= 5) && (hits <15)){
                        speedOfBall=3;
                        rodSpeed = 60;
                        ball.style.backgroundColor = "tomato";
                        
                    }
                    if(hits >= 15 && hits < 30){
                        rodSpeed = 70;
                        ball.style.width =  30 + 'px';
                        ball.style.height = 30 + 'px';
                        ball.style.backgroundColor = "fieryred";
                        rod1.style.width = 200 + 'px';
                        rod2.style.width = 200 + 'px';
                    }
            
                    if(hits >= 30 ){
                        speedOfBall=4;
                        rodSpeed = 80;
                        ball.style.width =  25 + 'px';
                        ball.style.height = 25 + 'px';
                        ball.style.backgroundColor = "darkred";
                        rod1.style.width = 150 + 'px';
                        rod2.style.width = 150 + 'px';
                    }
                }

                //reset the game
                function endGame(player,score,moveId){

                     //alert displayed on match ends
                     window.alert(player + 'wins with score of : '+ score );
                   
                    clearInterval(moveId);
                    ball.style.top = 50 + '%';
                    ball.style.left = 48 + '%';
                    score =0;
                    hits = 0;
                    rod1.style.left = 43 + '%';
                    rod2.style.left = 43 + '%';
                    speedOfBall=2;
                    rodSpeed = 50;
                    ball.style.width =  40 + 'px';
                    ball.style.height = 40 + 'px';
                    ball.style.backgroundColor = "yellow";
                    rod1.style.width = 250 + 'px';
                    rod2.style.width = 250 + 'px';
                }
            }           
        }   
    });   
}
