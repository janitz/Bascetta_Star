# matr.vbs

## what is the script doing?

 - the .vbs script creates a std 3d transformation matrix.<br>
 1 0 0 0<br>
 0 1 0 0<br>
 0 0 1 0<br>
 0 0 0 1

 - to this matrix transformations can be added serially.
  - translateX(px) 
  - translateY(px)
  - translateZ(px)
  - scaleX(factor)
  - scaleY(factor)
  - scaleZ(factor)
  - rotateX(deg)
  - rotateY(deg)
  - rotateZ(deg)

 - the matrix can be multiplied with a vector to transform the vector<br>
 x<br>
 y<br>
 z<br>
 1<br>

## what am i doing with the script?

 - create 3 vectors (3 points of a triangle)
 - create 60 transformation matrixes (20 jags * 3 sides per jag)
 - transform the 3 vectors with the 60 matrixes
 - copy the resulting vectors of the transformations to the star.js 
