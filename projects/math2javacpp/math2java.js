/* 
 *	Javascript to convert regular math expressions
 *	to Java or c++ syntax
 *
 *	Very messy code, sorry.  
 *
 *	Written by Simen Andresen, 2012 
 */

function convert_to_java(){
	convert("f1_in", "f1_out");
	convert("f2_in", "f2_out");
	convert("f3_in", "f3_out");
	convert("f4_in", "f4_out");

}

function convert(fin,fout){
	var f= document.getElementById(fin).value;
	if(document.myform.syntax[0].checked==true){  // fix to Math.sin only for java
		f=fixTrigFunctions(f);
	}
	f=fixExpFunctions(f);	
	if (check_matching_brackets(f)==false){
		document.getElementById("error").innerHTML="<br> Brackets not matching: Error!";
	}else if (check_matching_brackets(f)==true){
	}
	if (f!=""){
		document.getElementById(fout).innerHTML=f+"<hr />";
	}
}

function fixTrigFunctions(line){
	line = new String(line);
	var rx = /sin\(.*?\)|cos\(.*?\)|tan\(.*?\)/g;
	var matches = new Array();
	while((match = rx.exec(line)) !== null){
    	matches.push(match);
	}
	var new_word;
	var rege;
	var r1;	var r3;var r2;var temp;
	for (i=0;i<matches.length;i++){
		new_word="Math.".concat(matches[i]);
		r1=/\)[\*\-\+\/\w\[\]\^]*?\(/; 
		r2=(new String(matches[i]));
		r3=/(?!.htaM)/;
		rege=new RegExp(r1.source+r2.substr(0,3).reverse() + r3.source,"g");
		line= line.reverse().replace(rege, new_word.reverse()).reverse();
	}
	return line;
}

function insert_and_replace(string, inserted_string, index1, index2){
 	var first_part=string.slice(0,index1);
	var last_part=string.slice(index2);
	var new_string=first_part.concat(inserted_string).concat(last_part);
    return new_string;
}

String.prototype.reverse = function () {
	return this.split('').reverse().join('');
};

function check_matching_brackets(line){
	var fwd_brack_nr=0;
	var  bck_brack_nr=0;
	for (i=0;i<line.length;i++){
		if (line.charAt(i)=='('){
			fwd_brack_nr+=1;
		}else if (line.charAt(i)==')'){
			bck_brack_nr+=1;
		}
	}
	if (fwd_brack_nr==bck_brack_nr){
		return true;
	}else{
		return false;
	}
}

function fixExpFunctions(line){
	var exp_index=line.indexOf('^');
	var first_bracket;
	while (exp_index>-1){
		var exponent=line.charAt(exp_index+1);
		// the exponential is outside brackets -> something^2
		if  (!(line.charAt(exp_index-1)==')')){
			for (i=exp_index-1 ; i>=0; i--){ 
				first_bracket=i;
				if ((i==0) || (line.charAt(i-1).match( /[\s+*\(-]/i )) ){
					break;
				}
			}
			if(document.myform.syntax[0].checked==true){  // fix to Math.sin only for java
				line=insert_and_replace(line,'Math.pow'+'('+line.slice(first_bracket,exp_index)+','+exponent+')',first_bracket, exp_index+2);                  
			}else{
				line=insert_and_replace(line,'pow'+'('+line.slice(first_bracket,exp_index)+','+exponent+')',first_bracket, exp_index+2);                  
		}
		//if exponential without brackets (something)^2 
		}else if (line.charAt(exp_index-1)==')'){
			var brack_pairs=0;
			for (i=exp_index-1 ; i>=0; i--){ 
				if (line.charAt(i)==')'){ 
					brack_pairs+=1;
				}else if (line.charAt(i)=='('){
					brack_pairs-=1;
				}if (brack_pairs==0){
					first_bracket=i;
					break;
				}
			}
		}else{
			document.getElementById("error").innerHTML="syntax error in Maxima code!";
		}		
		exp_index=line.indexOf('^');
		//exp_index=null;	
	}
    return line;
}











