export  class DirectoryHelper  {

    private static imagesPath = "images/";

    public static getImage(imageName:string):string{
        return this.imagesPath+imageName;
    }
  }
  