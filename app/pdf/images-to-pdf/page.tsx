import type { Metadata } from 'next'
import Link from 'next/link'
import ToolLayout from '@/components/ToolLayout'
import ToolCard from '@/components/ToolCard'

export const metadata: Metadata = {
  title: '图片转 PDF 工具在线 - 多图合成 PDF（本地处理不上传）- toolo.cn',
  description:
    '在线 图片转 PDF 工具：在浏览器本地将多张 JPG/PNG/WebP 图片按顺序合成为一个 PDF 文件，支持拖拽排序和选择 A4 或原尺寸页面，不上传服务器，适合扫描件整理、作业提交与资料归档。',
  alternates: { canonical: 'https://toolo.cn/pdf/images-to-pdf' },
  openGraph: {
    type: 'website',
    url: 'https://toolo.cn/pdf/images-to-pdf',
    title: '图片转 PDF 工具在线 - 多图合成 PDF（本地处理不上传）- toolo.cn',
    description:
      '图片转 PDF 工具：在浏览器本地将多张图片按顺序合成为一个 PDF，支持拖拽排序与基础页面尺寸设置，不上传文件，适用于办公与学习场景。',
    siteName: 'toolo.cn',
  },
}

export default function ImagesToPdfPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: '图片转 PDF 工具',
        url: 'https://toolo.cn/pdf/images-to-pdf',
        operatingSystem: 'Web',
        applicationCategory: 'ProductivityApplication',
        description:
          '在线 图片转 PDF 工具：在浏览器本地将多张 JPG/PNG/WebP 图片按顺序合成为一个 PDF 文件，支持拖拽排序和 A4/原尺寸选择，不上传服务器，适合扫描件整理、作业提交与资料归档。',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'CNY',
        },
        featureList: ['多图合成一个 PDF', '支持拖拽排序', 'A4 或原尺寸页面选项', '本地处理不上传'],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: '使用图片转 PDF 工具时，图片会上传到服务器吗？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '不会。图片会在浏览器本地被读取并合成为 PDF 文件，不会上传到服务器或被云端保存，生成的 PDF 只会以你下载到本地的文件形式存在。',
            },
          },
          {
            '@type': 'Question',
            name: '支持哪些图片格式？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '当前支持常见的 JPG、JPEG、PNG 和 WebP 图片格式。你可以一次选择多张图片，工具会按排序结果依次生成 PDF 页面。',
            },
          },
          {
            '@type': 'Question',
            name: '如何调整图片在 PDF 中的顺序？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '选择图片后，在列表中可以通过“上移”和“下移”按钮调整图片顺序。PDF 会按照当前列表顺序依次生成页面，你可以在合成前反复微调顺序。',
            },
          },
          {
            '@type': 'Question',
            name: 'A4 和原尺寸页面有什么区别？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '选择 A4 时，每一页都会以 A4 比例创建，并将图片按最长边等比缩放适配页面，适合打印和标准文档尺寸；选择原尺寸时，会根据每张图片的像素尺寸创建对应大小的页面，更适合保留原始分辨率和比例。',
            },
          },
        ],
      },
    ],
  }

  return (
    <ToolLayout
      title="图片转 PDF"
      description="在浏览器本地将多张图片按顺序合成为一个 PDF 文件，不上传服务器，适合扫描件整理、作业提交与资料归档。"
      side={
        <div className="space-y-3">
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">常见用途</div>
            <ul className="mt-2 space-y-2 text-sm text-slate-600 leading-relaxed list-disc pl-5">
              <li>将手机拍摄的多张扫描件整理为一份 PDF，便于提交与归档。</li>
              <li>把多张票据、发票或证明材料合并成一个 PDF 文件统一报销。</li>
              <li>将课件截图、作业照片合成为一个 PDF，方便老师批阅。</li>
              <li>将产品图片或演示图片整理为 PDF 以便发送给客户或同事。</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">本地处理与隐私</div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              图片与生成的 PDF 均在浏览器本地处理，不上传服务器、不需登录，适合处理包含隐私内容的扫描件和材料。详情请查看{' '}
              <Link
                href="/privacy"
                className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
              >
                /privacy
              </Link>
              。
            </p>
          </div>
        </div>
      }
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-4 sm:px-6 lg:px-10 py-8 space-y-5">
        <div className="flex flex-wrap gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-500" />
            <span className="text-sm text-slate-700">本地处理</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-500" />
            <span className="text-sm text-slate-700">不上传</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-500" />
            <span className="text-sm text-slate-700">免费使用</span>
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">图片转 PDF 工具</h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            在浏览器本地将多张图片按顺序合成为一个 PDF 文件，支持拖拽排序与基础页面尺寸选择，不上传服务器，适合扫描件整理、作业提交和资料归档等高频场景。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="#images-to-pdf-tool"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            选择图片开始合成 PDF
          </a>
          <div className="text-xs sm:text-sm text-slate-600">
            支持多选与拖拽排序，所有处理在浏览器本地完成，不上传文件。
          </div>
        </div>
      </section>
      <section
        id="images-to-pdf-tool"
        className="rounded-3xl border border-slate-200 bg-white px-4 sm:px-6 lg:px-10 py-8 space-y-6 scroll-mt-24"
      >
        <h2 className="text-lg font-semibold text-slate-900">合成流程</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-3">
            <div className="text-sm font-medium text-slate-900">步骤一：选择多张图片</div>
            <p className="text-sm text-slate-600 leading-relaxed">
              点击按钮或将多张图片拖入区域中，支持 JPG/JPEG/PNG/WebP。建议按大致顺序选择，后续可以在列表中微调。
            </p>
            <div
              id="images-to-pdf-dropzone"
              className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 space-y-3"
            >
              <label
                htmlFor="images-to-pdf-input"
                className="flex cursor-pointer flex-col items-center justify-center gap-2 text-center"
              >
                <span
                  id="images-to-pdf-input-label"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
                >
                  选择要合成的图片
                </span>
                <span className="text-xs text-slate-500">支持多选，也可以直接将图片拖拽到此区域。</span>
              </label>
              <input
                id="images-to-pdf-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
              />
              <div className="space-y-1 text-xs text-slate-600">
                <div>
                  已选择图片数：
                  <span id="images-to-pdf-count" className="font-medium text-slate-900">
                    0
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="text-sm font-medium text-slate-900">步骤二：调整顺序与页面尺寸</div>
            <p className="text-sm text-slate-600 leading-relaxed">
              通过“上移”“下移”调整图片在 PDF 中的顺序，并选择是按 A4 页面还是按图片原尺寸生成 PDF 页面。
            </p>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 space-y-3 max-h-64 overflow-auto">
              <fieldset className="space-y-2">
                <legend className="text-xs font-medium text-slate-900">页面尺寸</legend>
                <div className="space-y-1 text-xs text-slate-700">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="images-to-pdf-page-size"
                      value="a4"
                      defaultChecked
                      className="h-3 w-3"
                    />
                    <span>A4 页面（适合打印和标准文档）</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="images-to-pdf-page-size" value="original" className="h-3 w-3" />
                    <span>按图片原尺寸生成页面（保持原始分辨率）</span>
                  </label>
                </div>
              </fieldset>
              <div className="mt-3 text-xs font-medium text-slate-900">图片顺序</div>
              <ul id="images-to-pdf-list" className="space-y-2 text-xs text-slate-700" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="text-sm font-medium text-slate-900">步骤三：生成并下载 PDF</div>
            <p className="text-sm text-slate-600 leading-relaxed">
              合成完成后，你可以下载生成的 PDF 文件。图片会按当前顺序依次成为 PDF 页面，建议在下载前先确认顺序与页面尺寸设置。
            </p>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 space-y-3">
              <div className="flex items-baseline justify-between text-xs text-slate-700">
                <span>生成的 PDF 大小</span>
                <span id="images-to-pdf-summary-size">—</span>
              </div>
              <button
                type="button"
                id="images-to-pdf-generate"
                className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                生成 PDF 文件
              </button>
              <a
                id="images-to-pdf-download"
                href="#"
                download
                className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white opacity-40 pointer-events-none"
              >
                下载合成后的 PDF
              </a>
              <div id="images-to-pdf-status" className="text-xs text-slate-500">
                选择图片并调整顺序后，点击“生成 PDF 文件”即可在浏览器本地完成合成并下载。
              </div>
            </div>
          </div>
        </div>
        <script src="https://unpkg.com/pdf-lib/dist/pdf-lib.min.js" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  var input = document.getElementById('images-to-pdf-input');
  var labelEl = document.getElementById('images-to-pdf-input-label');
  var dropzone = document.getElementById('images-to-pdf-dropzone');
  var listEl = document.getElementById('images-to-pdf-list');
  var countEl = document.getElementById('images-to-pdf-count');
  var generateButton = document.getElementById('images-to-pdf-generate');
  var downloadLink = document.getElementById('images-to-pdf-download');
  var summarySizeEl = document.getElementById('images-to-pdf-summary-size');
  var statusEl = document.getElementById('images-to-pdf-status');
  if (!input || !dropzone || !listEl || !countEl || !generateButton || !downloadLink || !summarySizeEl || !statusEl) return;

  var items = [];
  var objectUrl = null;

  function formatSize(bytes) {
    if (!bytes && bytes !== 0) return '—';
    if (bytes < 1024) return bytes + ' B';
    var kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(1) + ' KB';
    var mb = kb / 1024;
    return mb.toFixed(2) + ' MB';
  }

  /**
   * 将 Uint8Array 转换为 ArrayBuffer（处理 byteOffset 和 byteLength）
   * - 解决 TS 对 BlobPart / ArrayBufferLike 的兼容性报错（SharedArrayBuffer 场景）
   * - 显式创建新的 ArrayBuffer 并复制数据，确保类型与运行时都稳定
   */
  function u8ToArrayBuffer(u8) {
    var ab = new ArrayBuffer(u8.byteLength);
    new Uint8Array(ab).set(new Uint8Array(u8.buffer, u8.byteOffset, u8.byteLength));
    return ab;
  }

  function cleanupUrl() {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrl = null;
    }
  }

  function updateSummary() {
    countEl.textContent = String(items.length);
    summarySizeEl.textContent = '—';
    downloadLink.classList.add('opacity-40');
    downloadLink.classList.add('pointer-events-none');
    downloadLink.removeAttribute('href');
    downloadLink.removeAttribute('download');
    cleanupUrl();
  }

  function renderList() {
    listEl.innerHTML = '';
    items.forEach(function (item, index) {
      var li = document.createElement('li');
      li.className =
        'flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 gap-2';
      var left = document.createElement('div');
      left.className = 'flex-1 min-w-0';
      var name = document.createElement('div');
      name.className = 'truncate font-medium text-slate-900';
      name.textContent = item.file.name;
      var info = document.createElement('div');
      info.className = 'text-[11px] text-slate-500';
      info.textContent = formatSize(item.file.size);
      left.appendChild(name);
      left.appendChild(info);

      var right = document.createElement('div');
      right.className = 'flex items-center gap-1';
      var up = document.createElement('button');
      up.type = 'button';
      up.textContent = '上移';
      up.className =
        'inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50';
      up.addEventListener('click', function () {
        if (index <= 0) return;
        var tmp = items[index - 1];
        items[index - 1] = items[index];
        items[index] = tmp;
        renderList();
      });
      var down = document.createElement('button');
      down.type = 'button';
      down.textContent = '下移';
      down.className =
        'inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50';
      down.addEventListener('click', function () {
        if (index >= items.length - 1) return;
        var tmp2 = items[index + 1];
        items[index + 1] = items[index];
        items[index] = tmp2;
        renderList();
      });
      var remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = '删除';
      remove.className =
        'inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] text-rose-700 hover:bg-rose-100';
      remove.addEventListener('click', function () {
        items.splice(index, 1);
        if (items.length === 0 && labelEl) {
          labelEl.textContent = '选择要合成的图片';
        }
        updateSummary();
        renderList();
      });
      right.appendChild(up);
      right.appendChild(down);
      right.appendChild(remove);

      li.appendChild(left);
      li.appendChild(right);
      listEl.appendChild(li);
    });
  }

  function addFiles(fileList) {
    var arr = Array.prototype.slice.call(fileList || []);
    arr.forEach(function (f) {
      if (!f || !f.type) return;
      if (f.type === 'image/jpeg' || f.type === 'image/png' || f.type === 'image/webp') {
        items.push({ file: f });
      }
    });
    if (items.length === 0) {
      statusEl.textContent = '请至少选择一张 JPG/PNG/WebP 图片。';
      if (labelEl) labelEl.textContent = '选择要合成的图片';
    } else {
      statusEl.textContent = '已选择 ' + items.length + ' 张图片，你可以调整顺序后生成 PDF。';
      if (labelEl) labelEl.textContent = '已选择 ' + items.length + ' 张图片（点击重新选择）';
    }
    updateSummary();
    renderList();
  }

  // 确保 input 元素在页面加载时正确初始化（解决客户端路由切换后文件上传失效的问题）
  if (input) {
    input.value = '';
  }

  input.addEventListener('change', function () {
    items = [];
    cleanupUrl();
    addFiles(input.files);
  });

  dropzone.addEventListener('dragover', function (e) {
    e.preventDefault();
    dropzone.classList.add('ring-2', 'ring-slate-300');
  });

  dropzone.addEventListener('dragleave', function (e) {
    e.preventDefault();
    dropzone.classList.remove('ring-2', 'ring-slate-300');
  });

  dropzone.addEventListener('drop', function (e) {
    e.preventDefault();
    dropzone.classList.remove('ring-2', 'ring-slate-300');
    items = [];
    cleanupUrl();
    if (e.dataTransfer && e.dataTransfer.files) {
      addFiles(e.dataTransfer.files);
    }
  });

  function getPageMode() {
    var radios = document.querySelectorAll('input[name="images-to-pdf-page-size"]');
    var value = 'a4';
    radios.forEach(function (r) {
      if (r.checked) value = r.value;
    });
    return value;
  }

  generateButton.addEventListener('click', function () {
    if (!window.PDFLib) {
      statusEl.textContent = 'PDF 处理库加载中，请稍后重试。';
      return;
    }
    if (!items.length) {
      statusEl.textContent = '请先选择至少一张图片。';
      return;
    }

    statusEl.textContent = '正在本地生成 PDF，请稍候…';
    generateButton.disabled = true;
    cleanupUrl();
    summarySizeEl.textContent = '—';
    downloadLink.classList.add('opacity-40');
    downloadLink.classList.add('pointer-events-none');
    downloadLink.removeAttribute('href');
    downloadLink.removeAttribute('download');

    var PDFLib = window.PDFLib;
    var pageMode = getPageMode();

    (async function () {
      try {
        var pdfDoc = await PDFLib.PDFDocument.create();
        for (var i = 0; i < items.length; i++) {
          var file = items[i].file;
          var arrayBuffer = await file.arrayBuffer();
          var bytes = new Uint8Array(arrayBuffer);

          var image;
          var width;
          var height;

          if (file.type === 'image/png') {
            image = await pdfDoc.embedPng(bytes);
          } else if (file.type === 'image/jpeg') {
            image = await pdfDoc.embedJpg(bytes);
          } else if (file.type === 'image/webp' && pdfDoc.embedPng) {
            image = await pdfDoc.embedPng(bytes);
          } else {
            continue;
          }

          width = image.width;
          height = image.height;

          var pageWidth;
          var pageHeight;

          if (pageMode === 'a4') {
            var A4_WIDTH = 595.28;
            var A4_HEIGHT = 841.89;
            pageWidth = A4_WIDTH;
            pageHeight = A4_HEIGHT;
          } else {
            pageWidth = width;
            pageHeight = height;
          }

          var page = pdfDoc.addPage([pageWidth, pageHeight]);

          var scale = 1;
          if (pageMode === 'a4') {
            var scaleX = pageWidth / width;
            var scaleY = pageHeight / height;
            scale = Math.min(scaleX, scaleY, 1);
          }

          var drawWidth = width * scale;
          var drawHeight = height * scale;
          var x = (pageWidth - drawWidth) / 2;
          var y = (pageHeight - drawHeight) / 2;

          page.drawImage(image, { x: x, y: y, width: drawWidth, height: drawHeight });
        }

        var pdfBytes = await pdfDoc.save({ useObjectStreams: true });
        var size = pdfBytes.length;
        var blob = new Blob([u8ToArrayBuffer(pdfBytes)], { type: 'application/pdf' });
        objectUrl = URL.createObjectURL(blob);

        downloadLink.href = objectUrl;
        downloadLink.download = 'images-to-pdf.pdf';
        downloadLink.classList.remove('opacity-40');
        downloadLink.classList.remove('pointer-events-none');
        summarySizeEl.textContent = formatSize(size);
        statusEl.textContent = 'PDF 已在本地生成，可以点击“下载合成后的 PDF”保存到本地。';
      } catch (e) {
        statusEl.textContent = '生成 PDF 过程中出现错误，可以尝试减少图片数量或降低分辨率后重试。';
        cleanupUrl();
        summarySizeEl.textContent = '—';
        downloadLink.classList.add('opacity-40');
        downloadLink.classList.add('pointer-events-none');
        downloadLink.removeAttribute('href');
        downloadLink.removeAttribute('download');
      } finally {
        generateButton.disabled = false;
      }
    })();
  });

  window.addEventListener('beforeunload', function () {
    cleanupUrl();
  });
})();
          `.trim(),
          }}
        />
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-4 sm:px-6 lg:px-10 py-8 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">常见问题</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 bg白 px-5 py-4">
            <div className="text-sm font-medium text-slate-900">
              使用图片转 PDF 工具时，图片会上传到服务器吗？
            </div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              不会。图片会在浏览器本地被读取并合成为 PDF 文件，不会上传到服务器或被云端保存，生成的 PDF 只会以你下载到本地的文件形式存在。
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg白 px-5 py-4">
            <div className="text-sm font-medium text-slate-900">支持哪些图片格式？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              当前支持常见的 JPG、JPEG、PNG 和 WebP 图片格式。你可以一次选择多张图片，工具会按排序结果依次生成 PDF 页面。
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg白 px-5 py-4">
            <div className="text-sm font-medium text-slate-900">如何调整图片在 PDF 中的顺序？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              选择图片后，在“图片顺序”列表中可以通过“上移”和“下移”按钮调整顺序。PDF 会按照当前列表顺序依次生成页面，你可以在合成前反复微调。
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg白 px-5 py-4">
            <div className="text-sm font-medium text-slate-900">A4 和原尺寸页面有什么区别？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              选择 A4 时，每一页都会以 A4 比例创建，并将图片按最长边等比缩放适配页面，适合打印和标准文档尺寸；选择原尺寸时，会根据每张图片的像素尺寸创建对应大小的页面，更适合保留原始分辨率和比例。
            </div>
          </div>
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">相关 PDF 工具</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ToolCard
            href="/pdf/merge"
            title="PDF 合并"
            description="在浏览器本地将多个 PDF 按顺序合并为一个文件，适合资料整理与统一提交。"
            badge="基础版"
            tone="slate"
          />
          <ToolCard
            href="/pdf/compress"
            title="PDF 压缩"
            description="本地压缩 PDF 文件体积，适合邮件发送与平台上传大小受限场景。"
            badge="推荐"
            tone="slate"
          />
          <ToolCard
            href="/pdf/pdf-to-images"
            title="PDF 转图片"
            description="将 PDF 页面导出为图片，便于分享、预览或在图片工具中继续标注。"
            badge="基础版"
            tone="slate"
          />
        </div>
      </section>
    </ToolLayout>
  )
}