
Vue.component('channel-1',{
    template:'#body_note',
    props:['pnote','pnotes'],
    created(){
    },data(){
        return{
            cnote:this.pnote,
            cnotes:this.pnotes,
        }
            
    },
    methods:{
            createnote:function(Note){
            this.cnotes.push(Note);
            console.log(this.cnotes)
            },
        deletenote:function(Note){
            
            this.cnotes.splice(this.cnotes.indexOf(Note),1);
        }
       
    }
});
Vue.component('channel-2',{
    template:'#body_time',
    props:["ptimer"],
    data(){
        return{
            time:parseInt(this.ptimer)
        }
        
    },methods:{
        ChangeTime:function (){
            this.$parent.$emit('Change',this.time)
        }
    }
}),
Vue.component('channel-3',{
    template:'#body_cycle',
    created(){},
    props:["pcyc"],
    data(){
        return{
            cyc:parseInt(this.pcyc)
        }
    },
    methods:{
        ChangeCycle:function (cycle) {
            this.$parent.$emit('Changecyc',cycle);
        }
    }
})

new Vue({
    el:'#app',
    data:{
        notes:[],
        note:"新的記事",
        timercount:2,
        currentView:"channel-1",
        countDown:60*25,
        state:"WORK",
        start:false,
        cyc:4,
        cyccount:0
    },
        computed:{
            secdis:function () {
                if(Math.floor(this.countDown%60)<=9){
                    return '0'+Math.floor(this.countDown%60);
                }
                     return Math.floor(this.countDown%60);
            },
            mindis: function () {
                if (Math.floor(this.countDown / 60) <= 9) {
                    return '0' + Math.floor(this.countDown / 60);
                }
                else {
                    return Math.floor(this.countDown / 60);
                }
            },
            Btndis:function () {
                if(this.start==false){
                    return "Start";
                }
                else{
                    return "Pause";
                }
            }
            
        },methods:{
        updatenotes(cnotes){
            this.notes=cnotes;
        },
        countDownSecond (){
            if(this.countDown>0&this.start!==false){
                
                setTimeout(()=>{
                    this.countDown-=1;
                    
                    this.countDownSecond()},1000)
            }
            else{
                if(this.state==='WORK'&&this.countDown<=0){
                    document.querySelector(".almsnd").play();
                    this.cyccount+=1;
                    this.state='BREAK';
                    this.start=!this.start;
                    this.stateChange();
                }
                else{
                    if(this.countDown<=0){
                        this.state='WORK';
                        document.querySelector(".almsnd").play();
                        this.start=!this.start;
                        this.stateChange();
                    }
                    
                    
                }
            }
            
        },
        setTimercount(){
            this.countDown=60*this.timercount;
            
        }
        ,
        stateChange(){
            
            switch(this.state){
                case 'WORK':
                    this.setTimercount();
                    break;
                case'BREAK':
                    if(this.cyccount==this.cyc){
                         this.cycount=0;
                        this.countDown=15*60;//15min break
                    }
                    else{
                        this.countDown=300;
                        
                    }
                    break;  
            } 
        },
        BtnClick(){
            this.start=!this.start;
            document.querySelector(".clsnd").play();
            this.countDownSecond();          
        }
       
    }
    ,mounted(){
        var that=this;
        this.$on('Changecyc',function(cycle){
            that.cyc=cycle;
        })
        this.$on('Change',function (time) {
            
            that.timercount=parseInt(time);
            that.setTimercount();
            
        
        this.$on('update',this.updatenotes);
        })
    }
});
