/* i 
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
		f=fixTrigFunctions_java(f);
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


function fixTrigFunctions_java(line){
	var trigs = new Array("sin(", "cos(", "tan(");
	var trig_lengths=new Array(3,3,3);
	var start_indexes=new Array();
	var end_indexes = new Array();
	var index=0;
	var term=0;
	for(var i=0;i<trigs.length;i++){
		start_indexes[i]=new Array();
		end_indexes[i]=new Array();
		index=0;
		// make an array of indices for start of trigs
		term=line.indexOf(trigs[i],index);
		while(term !=-1){
			start_indexes[i].push(term+trig_lengths[i]);
			index=term+2;
			term=line.indexOf(trigs[i],index);
		}
		// find matching brakcets
		for(var j=0;j<start_indexes[i].length;j++){
			var brack_pairs=0;
			for(var k=start_indexes[i][j]; k < line.length;k++){
				if (line.charAt(k)==')'){ 
					brack_pairs+=1;
				}else if (line.charAt(k)=='('){
					brack_pairs-=1;
				}if (brack_pairs==0){
					end_indexes[i].push(k);
					break;
				}
			}
		}
	}
	var cnt1=0;
	var cnt=0;
	if(document.myform.syntax[0].checked==true){  // fix to Math.sin only for java
		for(var i=0;i<trigs.length;i++){
			for(var j=0;j<start_indexes[i].length;j++){
				line=insert_and_replace(line,"Mat.", start_indexes[i][j]-3,start_indexes[i][j]-3);
				// update indexes	
				for(var k=0;k<end_indexes.length;k++){
					for(var l=0;l<end_indexes[k].length;l++){
						if(start_indexes[k][l]>start_indexes[i][j]){
							start_indexes[k][l]=start_indexes[k][l]+4;
							end_indexes[k][l]=end_indexes[k][l]+4;
						}
					//	if(start_indexes[k][l]>end_indexes[i][j]+3){
					//		start_indexes[k][l]=start_indexes[k][l]+1;
					//	}
					//	if(start_indexes[k][l]>end_indexes[i][j]){
					//		end_indexes[k][l]=end_indexes[k][l]+1;
					//	}
					}
				}
			}
		}	
	}
	return line;
}

function update_trig_end_indexes(end,i,j){
	var ny_end=end;
	for(var k=0;k<end.length;k++){
		for(var l=0;l<end[k].length;l++){
			if(end[k][l]>end[i][j]){
				ny_end[k][l]=end[k][l]+5;
			}	
		}
	}	
	return ny_end;
}
function update_trig_start_indexes(start,i,j){
	var ny_start=start;
	for(var k=0;k<start.length;k++){
		for(var l=0;l<start[k].length;l++){
			if(end[k][l]>end[i][j]){
				ny_start[k][l]=start[k][l]+5;
			}	
		}
	}	
	return ny_start;
}

function print(string){
	var old_string=document.getElementById("error").innerHTML;
	document.getElementById("error").innerHTML=old_string.concat(string);
	
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
					if(i>2){
						var sub=line.substring(i-3,i);
						if(sub.match(/sin/g)|| sub.match(/tan/g) || sub.match(/cos/g)){
							if(document.myform.syntax[0].checked==true)	{
								first_bracket=i-7;
							}else{
								first_bracket=i-3;
							}
						}
						break;
					}else{
						first_bracket=i;
						break;
					}
				}
			}
			if(document.myform.syntax[0].checked==true){  // fix to Math.sin only for java
				line=insert_and_replace(line,'Math.pow'+'('+line.slice(first_bracket,exp_index)+','+exponent+')',first_bracket, exp_index+2);                  
			}else{
				line=insert_and_replace(line,'pow'+'('+line.slice(first_bracket,exp_index)+','+exponent+')',first_bracket, exp_index+2);                  
			}
		}else{
			document.getElementById("error").innerHTML="syntax error in Maxima code!";
		}		
		exp_index=line.indexOf('^');
	}
    return line;
}











