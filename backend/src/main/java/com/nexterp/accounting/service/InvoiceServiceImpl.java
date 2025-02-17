package com.nexterp.accounting.service;

/*
 * Description    : 거래명세서 서비스 구현
 * ProjectName    : NextERP
 * PackageName    : com.nexterp.accounting.service
 * FileName       : InvoiceServiceImpl
 * Author         : paesir
 * Date           : 25. 1. 16.
 * ===========================================================
 * DATE                  AUTHOR       NOTE
 * -----------------------------------------------------------
 * 25. 1. 16.오후 3:33  paesir      최초 생성
 */

import com.nexterp.accounting.dto.InvoiceDTO;
import com.nexterp.accounting.entity.Invoice;
import com.nexterp.accounting.entity.Transaction;
import com.nexterp.accounting.repository.InvoiceRepository;
import com.nexterp.accounting.repository.TransactionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class InvoiceServiceImpl implements InvoiceService {
  private final InvoiceRepository invoiceRepository;
  private final TransactionRepository transactionRepository;

  public InvoiceServiceImpl(InvoiceRepository invoiceRepository, TransactionRepository transactionRepository) {
    this.invoiceRepository = invoiceRepository;
    this.transactionRepository = transactionRepository;
  }

  // 모든 인보이스 조회
  @Override
  public Page<InvoiceDTO> getAllInvoices(Pageable pageable) {
    return invoiceRepository.findAll(pageable).map(this::entityToDTO);
  }

  // id 별 조회
  @Override
  public InvoiceDTO getInvoiceById(Long id) {
    return invoiceRepository.findById(id)
            .map(this::entityToDTO)
            .orElseThrow(() -> new IllegalArgumentException("Invoice not found: " + id));
  }

  // 인보이스 생성
  @Override
  public InvoiceDTO createInvoice(InvoiceDTO invoiceDTO, Long transactionId) {
    Transaction transaction = transactionRepository.findById(transactionId)
            .orElseThrow(() -> new IllegalArgumentException("Transaction not found: " + transactionId));

    Invoice invoice = dtoToEntity(invoiceDTO, transaction);
    Invoice savedInvoice = invoiceRepository.save(invoice);

    if (savedInvoice.getId() == null) {
      throw new RuntimeException("Invoice 저장 후 ID가 null입니다. transactionId: " + transactionId);
    }

    return entityToDTO(savedInvoice);
  }

  // 업데이트
  @Override
  public InvoiceDTO updateInvoice(Long id, InvoiceDTO invoiceDTO) {
    Invoice invoice = invoiceRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Invoice not found: " + id));

    Transaction transaction = invoice.getTransaction();

    Invoice updatedInvoice = dtoToEntity(invoiceDTO, transaction);
    updatedInvoice.setId(invoice.getId()); // 기존 ID 유지
    Invoice savedInvoice = invoiceRepository.save(updatedInvoice);

    return entityToDTO(savedInvoice);
  }

  // 삭제
  @Override
  public void deleteInvoice(Long id) {
    if (!invoiceRepository.existsById(id)) {
      throw new IllegalArgumentException("Invoice not found: " + id);
    }
    invoiceRepository.deleteById(id);
  }

  private InvoiceDTO entityToDTO(Invoice invoice) {
    return InvoiceDTO.builder()
            .id(invoice.getId())  // Transaction ID와 동일한 ID 사용
            .invoiceNumber(invoice.getInvoiceNumber())
            .date(invoice.getDate())
            .buyer(invoice.getBuyer())
            .seller(invoice.getSeller())
            .totalAmount(invoice.getTotalAmount())
            .vatAmount(invoice.getVatAmount())
            .description(invoice.getDescription())
            .items(null) // ✅ InvoiceItem 관련 처리는 별도 서비스에서 진행
            .build();
  }

  private Invoice dtoToEntity(InvoiceDTO invoiceDTO, Transaction transaction) {
    Invoice invoice = new Invoice();
    invoice.setId(invoiceDTO.getId());
    invoice.setTransaction(transaction);
    invoice.setInvoiceNumber(invoiceDTO.getInvoiceNumber());
    invoice.setDate(invoiceDTO.getDate());
    invoice.setBuyer(invoiceDTO.getBuyer());
    invoice.setSeller(invoiceDTO.getSeller());
    invoice.setTotalAmount(invoiceDTO.getTotalAmount());
    invoice.setVatAmount(invoiceDTO.getVatAmount());
    invoice.setDescription(invoiceDTO.getDescription());
    return invoice;
  }
}