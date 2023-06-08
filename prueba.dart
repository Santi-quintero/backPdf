                // Container(
                //   // color: Colors.red,
                //   decoration:
                //       BoxDecoration(border: Border.all(color: Colors.black)),
                //   width: 900,
                //   height: 700,
                //   // width: 595.276,
                //   // height: 841.89,
                //   child: Stack(
                //     children: [
                //       PdfViewer.openFile(uri,
                //           params: PdfViewerParams(
                //               padding: 0,
                //               layoutPages: (viewSize, pages) {
                //                 List<Rect> rect = [];
                //                 final viewWidth = viewSize.width;
                //                 final viewHeight = viewSize.height;
                //                 final maxHeight = pages.fold<double>(
                //                     0.0,
                //                     (maxHeight, page) =>
                //                         max(maxHeight, page.height));
                //                 final ratio = viewHeight / maxHeight;
                //                 var top = 0.0;
                //                 for (var page in pages) {
                //                   final width = page.width * ratio;
                //                   final height = page.height * ratio;
                //                   final left = viewWidth > viewHeight
                //                       ? (viewWidth / 2) - (width / 2)
                //                       : 0.0;
                //                   rect.add(
                //                       Rect.fromLTWH(left, top, width, height));
                //                   top += (height + 8);
                //                   ancho = width;
                //                   print('Ancho de la página: $ancho');
                //                   alto = maxHeight;
                //                   print('alto: $alto');
                //                 }
                //                 return rect;
                //               })),
                //       GestureDetector(
                //         onTapDown: (details) {
                //           setState(() {
                //             startPoint = details.localPosition;
                //             endPoint =
                //                 Offset(startPoint!.dx + 80, startPoint!.dy);
                //             currentLine = Line(startPoint!.dx, startPoint!.dy,
                //                 endPoint!.dx, endPoint!.dy);
                //             isDrawing = true;
                //           });
                //         },
                //         onTapUp: (details) {
                //           setState(() {
                //             if (currentLine != null) {
                //               // Resto de tu código
                //               print('x1: ${currentLine?.x1}');
                //               print('y1: ${currentLine?.y1}');
                //               print('x2: ${currentLine?.x2}');
                //               print('y2: ${currentLine?.x2}');
                //             }
                //             isDrawing = false;
                //           });
                //         },
                //         child: Container(
                //           width: 900,
                //           height: 700,
                //           color: Colors
                //               .transparent, // Fondo transparente para superponerse al PDF
                //           child: CustomPaint(
                //             painter: LinePainter(line: currentLine),
                //             child: Container(),
                //           ),
                //         ),
                //       ),
                //     ],
                //   ),
                // ),






                //                         PdfViewer.openFile(uri,
                //             params: PdfViewerParams(
                //                 padding: 0,
                //                 layoutPages: (viewSize, pages) {
                //                   List<Rect> rect = [];
                //                   final viewWidth = viewSize.width;
                //                   final viewHeight = viewSize.height;
                //                   final maxHeight = pages.fold<double>(
                //                       0.0,
                //                       (maxHeight, page) =>
                //                           max(maxHeight, page.height));
                //                   final ratio = viewHeight / maxHeight;
                //                   var top = 0.0;
                //                   for (var page in pages) {
                //                     final width = page.width * ratio;
                //                     final height = page.height * ratio;
                //                     final left = viewWidth > viewHeight
                //                         ? (viewWidth / 2) - (width / 2)
                //                         : 0.0;
                //                     rect.add(Rect.fromLTWH(
                //                         left, top, width, height));
                //                     top += (height + 8);
                //                     ancho = width;
                //                     print('Ancho de la página: $ancho');
                //                     alto = maxHeight;
                //                     print('alto: $alto');
                //                   }
                //                   return rect;
                //                 })),

                //             PdfViewer.openFile(uri,
                //             params: PdfViewerParams(
                //                 padding: 0,)),