import type { Metadata } from 'next'
import Link from 'next/link'
import ToolLayout from '@/components/ToolLayout'
import ToolCard from '@/components/ToolCard'

export const metadata: Metadata = {
  title: '在线 PDF 合并工具 - 合并多个 PDF 文件（本地处理不上传）- toolo.cn',
  description:
    '在线 PDF 合并工具：在浏览器本地将多个 PDF 按顺序合并为一个文件，不上传服务器，适合资料整理、合同归档、作业与报告统一提交，combine pdf files 与 merge pdf online 的同时保护隐私。',
  alternates: { canonical: 'https://toolo.cn/pdf/merge' },
  openGraph: {
    type: 'website',
    url: 'https://toolo.cn/pdf/merge',
    title: '在线 PDF 合并工具 - 合并多个 PDF 文件（本地处理不上传）- toolo.cn',
    description:
      'PDF 合并工具：在浏览器中本地合并多个 PDF 为一个文件，支持调节顺序并下载合并后的 PDF，不上传文件，适合办公和学习场景。',
    siteName: 'toolo.cn',
  },
}

export default function PdfMergePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: '在线 PDF 合并工具',
        url: 'https://toolo.cn/pdf/merge',
        operatingSystem: 'Web',
        applicationCategory: 'ProductivityApplication',
        description:
          '在线 PDF 合并工具：在浏览器本地按顺序合并多个 PDF 文件为一个，不上传服务器，适合资料整理、合同归档和统一提交报告，是安全的 merge pdf online 与 combine pdf files 工具。',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'CNY',
        },
        featureList: [
          '本地合并多个 PDF 文件',
          '支持调整合并顺序',
          '生成并下载合并后的 PDF',
          '显示合并前文件数量与合并后大小',
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: '使用这个 PDF 合并工具时，文件会上传到服务器吗？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '不会。PDF 文件会在浏览器本地读取和合并，不会上传到服务器或被云端保存，合并完成后只会生成一个你可以下载的合并后 PDF 文件。',
            },
          },
          {
            '@type': 'Question',
            name: '这个 PDF 合并工具适合哪些使用场景？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '适合整理多份扫描件、票据或证明材料统一提交，合同与补充协议的归档保存，多篇作业或报告打包成一个文件发送，以及将分散的课件合并方便阅读与打印等场景。',
            },
          },
          {
            '@type': 'Question',
            name: '合并后的 PDF 会改变原来的内容或清晰度吗？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '合并操作不会对页面内容做压缩或重采样，主要是把多个 PDF 文件按顺序拼接在一起，页面内容和清晰度原则上保持不变，只是合并成一个新的 PDF 文件。',
            },
          },
          {
            '@type': 'Question',
            name: '合并多个 PDF 时有数量或大小限制吗？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '合并在浏览器本地完成，主要受限于设备内存和浏览器性能。单个文件或总大小过大时可能会变慢或失败，建议一次合并数量适中，并根据设备性能合理控制每个文件大小。',
            },
          },
        ],
      },
    ],
  }

  return (
    <ToolLayout
      title="PDF 合并"
      description="在浏览器本地将多个 PDF 按顺序合并为一个文件，不上传服务器，适合资料整理与统一提交。"
      side={
        <div className="space-y-3">
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">本地处理与隐私</div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              本工具在浏览器中本地合并多个 PDF，不上传服务器、不需登录，适合处理合同、证明、报告等隐私文档。详情请查看{' '}
              <Link
                href="/privacy"
                className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
              >
                /privacy
              </Link>
              。
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-5 py-5">
            <div className="text-sm font-semibold text-slate-900">适用场景</div>
            <ul className="mt-2 space-y-2 text-sm text-slate-600 leading-relaxed list-disc pl-5">
              <li>多份扫描件、票据或证明材料打包成一个 PDF 统一提交。</li>
              <li>合同正文与补充协议、附件等多份文件整理到同一个文件中归档。</li>
              <li>多份作业、报告或课件按顺序合并，方便老师或同事查阅。</li>
              <li>将零散的项目文档合并，便于长期存档与备份。</li>
            </ul>
          </div>
        </div>
      }
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-6 sm:px-10 py-8 space-y-5">
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
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">在线 PDF 合并工具</h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            在浏览器本地按顺序合并多个 PDF 文件为一个，不上传服务器，适合资料整理、合同归档、作业与报告统一提交等场景，兼顾使用便捷性与隐私安全。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="#pdf-merge-tool"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            选择 PDF 文件开始合并
          </a>
          <div className="text-xs sm:text-sm text-slate-600">
            支持多选和拖拽排序，所有合并在浏览器本地完成，不上传文件。
          </div>
        </div>
      </section>
      <section
        id="pdf-merge-tool"
        className="rounded-3xl border border-slate-200 bg-white px-6 sm:px-10 py-8 space-y-6 scroll-mt-24"
      >
        <h2 className="text-lg font-semibold text-slate-900">合并流程</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-3">
            <div className="text-sm font-medium text-slate-900">步骤一：选择多个 PDF 文件</div>
            <p className="text-sm text-slate-600 leading-relaxed">
              点击选择或将多个 PDF 文件一次性拖入，文件会在浏览器本地读取，适合将多份材料按顺序整理到一起。
            </p>
            <div
              id="pdf-merge-dropzone"
              className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 space-y-3"
            >
              <label
                htmlFor="pdf-merge-input"
                className="flex cursor-pointer flex-col items-center justify-center gap-2 text-center"
              >
                <span className="text-sm font-medium text-slate-900">点击选择或拖拽多个 PDF 文件</span>
                <span className="text-xs text-slate-500">建议单个文件大小适中，以保证浏览器稳定性。</span>
              </label>
              <input id="pdf-merge-input" type="file" multiple accept="application/pdf" className="hidden" />
              <div className="space-y-1 text-xs text-slate-600">
                <div>
                  已选择文件数：
                  <span id="pdf-merge-count" className="font-medium text-slate-900">
                    0
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="text-sm font-medium text-slate-900">步骤二：调整合并顺序</div>
            <p className="text-sm text-slate-600 leading-relaxed">
              按照最终阅读顺序调整文件位置，支持向上/向下移动，也可以删除不需要参与合并的文件。
            </p>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 space-y-3 max-h-64 overflow-auto">
              <div className="text-xs font-medium text-slate-900">合并顺序</div>
              <ul id="pdf-merge-list" className="space-y-2 text-xs text-slate-700" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="text-sm font-medium text-slate-900">步骤三：合并并下载</div>
            <p className="text-sm text-slate-600 leading-relaxed">
              在浏览器中完成本地合并后，可以下载合并后的单个 PDF 文件，并查看合并前的文件数量与合并后文件大小。
            </p>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 space-y-3">
              <div className="flex items-baseline justify-between text-xs text-slate-700">
                <span>合并前文件数</span>
                <span id="pdf-merge-summary-count">0</span>
              </div>
              <div className="flex items-baseline justify-between text-xs text-slate-700">
                <span>合并后文件大小</span>
                <span id="pdf-merge-summary-size">—</span>
              </div>
              <button
                type="button"
                id="pdf-merge-button"
                className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                合并并生成 PDF
              </button>
              <a
                id="pdf-merge-download"
                href="#"
                download
                className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white opacity-40 pointer-events-none"
              >
                下载合并后 PDF
              </a>
              <div id="pdf-merge-status" className="text-xs text-slate-500">
                选择多个 PDF 文件后，可调整顺序并点击“合并并生成 PDF”，所有处理在本地完成，不上传文件。
              </div>
            </div>
          </div>
        </div>
        <script src="https://unpkg.com/pdf-lib/dist/pdf-lib.min.js" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  var input = document.getElementById('pdf-merge-input');
  var dropzone = document.getElementById('pdf-merge-dropzone');
  var listEl = document.getElementById('pdf-merge-list');
  var countEl = document.getElementById('pdf-merge-count');
  var summaryCountEl = document.getElementById('pdf-merge-summary-count');
  var summarySizeEl = document.getElementById('pdf-merge-summary-size');
  var mergeButton = document.getElementById('pdf-merge-button');
  var downloadLink = document.getElementById('pdf-merge-download');
  var statusEl = document.getElementById('pdf-merge-status');
  if (!input || !dropzone || !listEl || !countEl || !summaryCountEl || !summarySizeEl || !mergeButton || !downloadLink || !statusEl) return;

  var files = [];
  var objectUrl = null;

  function formatSize(bytes) {
    if (!bytes && bytes !== 0) return '—';
    if (bytes < 1024) return bytes + ' B';
    var kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(1) + ' KB';
    var mb = kb / 1024;
    return mb.toFixed(2) + ' MB';
  }

  function cleanupUrl() {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrl = null;
    }
  }

  function renderList() {
    listEl.innerHTML = '';
    files.forEach(function (item, index) {
      var li = document.createElement('li');
      li.className =
        'flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 gap-2';
      var left = document.createElement('div');
      left.className = 'flex-1 min-w-0';
      var name = document.createElement('div');
      name.className = 'truncate font-medium text-slate-900';
      name.textContent = item.file.name;
      var size = document.createElement('div');
      size.className = 'text-[11px] text-slate-500';
      size.textContent = formatSize(item.file.size);
      left.appendChild(name);
      left.appendChild(size);

      var right = document.createElement('div');
      right.className = 'flex items-center gap-1';
      var up = document.createElement('button');
      up.type = 'button';
      up.textContent = '上移';
      up.className =
        'inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50';
      up.addEventListener('click', function () {
        if (index <= 0) return;
        var tmp = files[index - 1];
        files[index - 1] = files[index];
        files[index] = tmp;
        updateSummary();
        renderList();
      });
      var down = document.createElement('button');
      down.type = 'button';
      down.textContent = '下移';
      down.className =
        'inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50';
      down.addEventListener('click', function () {
        if (index >= files.length - 1) return;
        var tmp2 = files[index + 1];
        files[index + 1] = files[index];
        files[index] = tmp2;
        updateSummary();
        renderList();
      });
      var remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = '删除';
      remove.className =
        'inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] text-rose-700 hover:bg-rose-100';
      remove.addEventListener('click', function () {
        files.splice(index, 1);
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

  function updateSummary() {
    countEl.textContent = String(files.length);
    summaryCountEl.textContent = String(files.length);
    summarySizeEl.textContent = '—';
    downloadLink.classList.add('opacity-40');
    downloadLink.classList.add('pointer-events-none');
    downloadLink.removeAttribute('href');
    downloadLink.removeAttribute('download');
    cleanupUrl();
  }

  function addFiles(fileList) {
    var arr = Array.prototype.slice.call(fileList || []);
    arr.forEach(function (f) {
      if (f && f.type === 'application/pdf') {
        files.push({ file: f });
      }
    });
    if (files.length === 0) {
      statusEl.textContent = '请至少选择一个 PDF 文件用于合并。';
    } else {
      statusEl.textContent = '已选择 ' + files.length + ' 个 PDF 文件，可以调整顺序后开始合并。';
    }
    updateSummary();
    renderList();
  }

  input.addEventListener('change', function () {
    files = [];
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
    files = [];
    cleanupUrl();
    if (e.dataTransfer && e.dataTransfer.files) {
      addFiles(e.dataTransfer.files);
    }
  });

  mergeButton.addEventListener('click', function () {
    if (!window.PDFLib) {
      statusEl.textContent = 'PDF 合并库加载中，请稍后重试。';
      return;
    }
    if (files.length === 0) {
      statusEl.textContent = '请先选择至少一个 PDF 文件。';
      return;
    }

    statusEl.textContent = '正在本地合并 PDF，请稍候…';
    mergeButton.disabled = true;

    var PDFLib = window.PDFLib;

    (async function () {
      try {
        var mergedPdf = await PDFLib.PDFDocument.create();
        for (var i = 0; i < files.length; i++) {
          var f = files[i].file;
          var arrayBuffer = await f.arrayBuffer();
          var srcDoc = await PDFLib.PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
          var copiedPages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
          copiedPages.forEach(function (p) {
            mergedPdf.addPage(p);
          });
        }
        var mergedBytes = await mergedPdf.save({ useObjectStreams: true });
        var size = mergedBytes.length;
        cleanupUrl();
        var blob = new Blob([mergedBytes], { type: 'application/pdf' });
        objectUrl = URL.createObjectURL(blob);
        downloadLink.href = objectUrl;
        downloadLink.download = 'merged.pdf';
        downloadLink.classList.remove('opacity-40');
        downloadLink.classList.remove('pointer-events-none');
        summarySizeEl.textContent = formatSize(size);
        statusEl.textContent = '合并完成，已在本地生成新的 PDF 文件，可以点击按钮下载。';
      } catch (e) {
        statusEl.textContent = '合并过程中出现错误，可以尝试减少文件数量或重新选择文件。';
      } finally {
        mergeButton.disabled = false;
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
      <section className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-sm px-6 sm:px-10 py-8 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">常见问题</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">
              使用这个 PDF 合并工具时，文件会上传到服务器吗？
            </div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              不会。PDF 文件在浏览器本地读取和合并，不会上传到服务器或被云端保存，合并完成后只会生成一个你可以下载的合并后 PDF 文件。
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">这个 PDF 合并工具适合哪些使用场景？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              适合整理多份扫描件、票据或证明材料统一提交，合同与补充协议的归档保存，多篇作业、报告或课件按顺序合并，便于老师、同事或客户一次性查看。
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">合并后的 PDF 会改变原来的内容或清晰度吗？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              合并操作以“拼接页面”为主，不对单页内容做压缩或重采样，一般不会改变页面清晰度。只有在你后续对合并后的文件再进行压缩时，才可能影响图片质量。
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <div className="text-sm font-medium text-slate-900">一次可以合并多少个 PDF 文件？</div>
            <div className="mt-1 text-sm text-slate-600 leading-relaxed">
              工具本身不人为限制数量，实际受限于浏览器和设备内存。若一次选择的文件过多或总大小过大，可能会出现变慢或失败的情况，建议按项目和场景分批合并。
            </div>
          </div>
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">相关 PDF 工具</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ToolCard
            href="/pdf/compress"
            title="PDF 压缩"
            description="在浏览器本地压缩 PDF 体积，适合邮件发送和平台上传大小受限场景。"
            badge="推荐"
            tone="slate"
          />
          <ToolCard
            href="/pdf/split"
            title="PDF 拆分"
            description="按页码范围拆分 PDF 文件，适合同一文档按章节或材料拆分提交。"
            badge="基础版"
            tone="slate"
          />
          <ToolCard
            href="/pdf/images-to-pdf"
            title="图片转 PDF"
            description="将多张图片合并为一个 PDF 文件，适合作业、票据和扫描件整理。"
            badge="基础版"
            tone="slate"
          />
        </div>
      </section>
    </ToolLayout>
  )
}