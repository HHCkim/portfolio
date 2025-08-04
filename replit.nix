{ pkgs }: {
  deps = [
    pkgs.nodejs-20_x
    pkgs.nodePackages.typescript-language-server
    pkgs.nodePackages.serve
    pkgs.yarn
    pkgs.replitPackages.jest
  ];
  
  env = {
    LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [];
  };
}