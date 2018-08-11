'Declare and set array element values
dim matrixOut(3,3)
dim matrixIn1(3,3)
dim matrixIn2(3,3)
dim vectorIn1(3)
dim vectorIn2(3)
dim vectorIn3(3)
dim vectorOut(3)

vectorIn1(0) = 0
vectorIn1(1) = -153.88
vectorIn1(2) = 0
vectorIn1(3) = 1

vectorIn2(0) = -50
vectorIn2(1) = 0
vectorIn2(2) = 0
vectorIn2(3) = 1

vectorIn3(0) = 50 
vectorIn3(1) = 0 
vectorIn3(2) = 0
vectorIn3(3) = 1


main

sub main()
    dim lines(59)
    dim order : order = array(0,1,2,16,36,41,29,14,52,4,19,56,37,39,17,38,40,15,28,13,51,55,3,18,33,26,48,21,44,59,7,11,45,49,24,34,42,22,57,53,12,27,20,54,5,23,43,58,10,6,47,30,31,32,46,8,9,25,50,35)

    cnt = 0

    initMatrixVals

    for yy = 0 to 3
        for xx = 0 to 4
            for zz = 0 to 2
                translateY -68.82
                rotateZ 72 * xx
                translateY 68.82

                if yy = 0 then
                    rotateX 10.81
                    translateZ 28.87
                    translateY -75.57
                elseif yy = 1 then
                    rotateX -10.81
                    translateZ -28.87
                    translateY -75.57
                    rotateX -42
                elseif yy = 2 then
                    rotateX 10.81
                    translateZ 28.87
                    translateY -75.57
                    rotateX 180
                elseif yy = 3 then
                    rotateX -10.81
                    translateZ -28.87
                    translateY -75.57
                    rotateX -42
                    rotateX 180
                end if

            
                rotateY 120 * zz
                
                rotateX -37.38

                str = "f.addPath(["
                multiplyVector vectorIn1
                str = str & VectorOut2String & ","
                multiplyVector vectorIn2
                str = str & VectorOut2String & ","
                multiplyVector vectorIn3
                str = str & VectorOut2String
                str = str & "], " & "PLACEHOLDER" & ");" & vbCrlf
                
                lines(cnt) = str
                cnt = cnt + 1
                
                initMatrixVals
            next
        next
    next
    
    str = ""
    for cc = 0 to 59
        line = lines(order(cc))
        line = replace(line, "PLACEHOLDER", int(cc / 3))
        str = str & line
    next
    
    createFile str
end sub


sub initMatrixVals()
    for y = 0 to 3
        for x = 0 to 3
            if y = x then
                matrixOut(y, x) = 1
            else
                matrixOut(y, x) = 0
            end if  
        next              
    next
end sub

sub prepareMatrixVals()
    for y = 0 to 3
        for x = 0 to 3
            matrixIn1(y, x) = matrixOut(y, x)
            if y = x then
                matrixIn2(y, x) = 1
            else
                matrixIn2(y, x) = 0
            end if  
        next              
    next
end sub

function deg2rad(deg)
    deg2rad = deg * 3.14159265 / 180
end function

sub multiply()
    for y = 0 to 3
        for x = 0 to 3
            matrixOut(y, x) = 0  
        next             
    next

    for i = 0 to 3                                'rows of matrixOut
        for k = 0 to 3                            'columns of matrixOut
            for j = 0 to 3                        'rows of matrixIn1 / columns of matrixIn2
                matrixOut(i, k) = matrixOut(i, k) + (matrixIn1(i, j) * matrixIn2(j, k))   
            next
        next
    next
end sub


sub translateX(distance)
    prepareMatrixVals
    matrixIn2(3, 0) = distance
    multiply
end sub

sub translateY(distance)
    prepareMatrixVals
    matrixIn2(3, 1) = distance
    multiply
end sub

sub translateZ(distance)
    prepareMatrixVals
    matrixIn2(3, 2) = distance
    multiply
end sub

sub scaleX(factor)
    prepareMatrixVals
    matrixIn2(0, 0) = factor
    multiply
end sub

sub scaleY(factor)
    prepareMatrixVals
    matrixIn2(1, 1) = factor
    multiply
end sub

sub scaleZ(factor)
    prepareMatrixVals
    matrixIn2(2, 2) = factor
    multiply
end sub

sub rotateX(angle)
    prepareMatrixVals
    c = cos(deg2rad(angle))
    s = sin(deg2rad(angle))
    matrixIn2(1, 1) = c
    matrixIn2(1, 2) = s
    matrixIn2(2, 1) = -s
    matrixIn2(2, 2) = c
    multiply
end sub

sub rotateY(angle)
    prepareMatrixVals
    c = cos(deg2rad(angle))
    s = sin(deg2rad(angle))
    matrixIn2(0, 0) = c
    matrixIn2(0, 2) = -s
    matrixIn2(2, 0) = s
    matrixIn2(2, 2) = c
    multiply
end sub

sub rotateZ(angle)
    prepareMatrixVals
    c = cos(deg2rad(angle))
    s = sin(deg2rad(angle))
    matrixIn2(0, 0) = c
    matrixIn2(0, 1) = s
    matrixIn2(1, 0) = -s
    matrixIn2(1, 1) = c
    multiply
end sub

sub multiplyVector(vector)
    for i = 0 to 3
        vectorOut(i) = 0
        for j = 0 to 3
            vectorOut(i) = vectorOut(i) + (vector(j) * matrixOut(j,i))
        next
    next
end sub


function MatrixOut2String()
    str = "matrix3d("
    for y = 0 to 3
        for x = 0 to 3
            str = str & replace(cStr(round(matrixOut(y, x), 3)), ",", ".")  + ","  
        next               
    next
    str = left(str, len(str) - 1) & ");" & vbCrlf
    MatrixOut2String = str
end function

function VectorOut2String
     str = "["
     for x = 0 to 2
        str = str & replace(cStr(round(VectorOut(x), 3)), ",", ".")  + ","  
    next 
    
    str = left(str, len(str) - 1) & "]"
    
    VectorOut2String = str
end function

sub createFile(str)
   dim fso, tf
   set fso = createObject("Scripting.FileSystemObject")
   set tf = fso.createTextFile("matrix.txt", true)
   tf.write(str)
   tf.close
end sub